const updateDashboard = require("../../../../service/report/updateDashBoard/WaterDistribute/updateDashboard");
const updateDashboardBranchInfo = require("../../../../service/report/updateDashBoard/WaterDistribute/updateDashboardBranchInfo");
const getSingleDocFromCollection = require("../../../../service/utils/getSingleDocFromCollection");
const updateCalculatorAmount = require("../../../../service/utils/updateCalculatorAmount");
const updateSheetStatus = require("../../../../service/utils/updateSheetStatus");
const updateTable = require("../../../../service/utils/updateTable");

/**
 * Distribute water and update related tables and data.
 *
 * @param {Object} data - The water distribution data.
 * @param {Function} db - A function to get the Firestore database instance.
 * @param {Function} batch - A function to create a Firestore batch.
 */
const waterDistribute = async (data, db, batch) => {
  try {
    // Creating a new credit document in the "CardFee" collection
    const companyGain = await getSingleDocFromCollection("companyGain");
    if (!companyGain) {
      throw new Error(
        "Company gain information is missing.Please refresh your browser and try again."
      );
    }
    data.amount = data.numberOfCard * companyGain.water_distribute_gain;

    // Updating various tables with waterDistribute information

    // First update: Change the daily table
    await updateTable(
      db,
      "tables",
      data.activeTable,
      data.deliveryguyId,
      "total",
      {
        waterDistribute: data.numberOfCard,
        total: data.numberOfCard * companyGain.water_distribute_gain,
      },
      batch
    );

    // Second update: Change the 15 days summary and daily summary tables
    await updateTable(
      db,
      "tables",
      data.activeDailySummery,
      data.date,
      "total",
      {
        waterDistribute: data.numberOfCard,
        total: data.numberOfCard * companyGain.water_distribute_gain,
      },
      batch
    );

    // Third update: Individual person's daily work summary
    const newIncome = await updateTable(
      db,
      "tables",
      data.active,
      data.deliveryguyId,
      "total",
      {
        waterDistribute: data.numberOfCard,
        total: data.numberOfCard * companyGain.water_distribute_gain,
      },
      batch
    );

    // Fourth update: Salary of the delivery guy table
    if (!newIncome) {
      throw new Error(
        "Branch summery table information is missing.Please refresh your browser and try again."
      );
    }
    // Fourth update: Salary of the delivery guy table

    const newStatus = await updateSheetStatus(
      db,
      batch,
      data.active,
      "totalIncome",
      newIncome.total.total +
        data.numberOfCard * companyGain.water_distribute_gain
    );

    if (!newStatus) {
      throw new Error(
        "Branch sheet status information is missing.Please refresh your browser and try again."
      );
    }
    // Updating dashboard with newIncome and newSalaryExpense details
    await updateDashboard(
      db,
      batch,
      data.branchId,
      newStatus.totalIncome ? newStatus.totalIncome : 0,
      newStatus.totalExpense ? newStatus.totalExpense : 0,
      data.numberOfCard * companyGain.water_distribute_gain
    );

    // Updating dashboard branch information
    await updateDashboardBranchInfo(
      db,
      batch,
      data.branchId,
      newStatus.totalIncome ? newStatus.totalIncome : 0,
      newStatus.totalExpense ? newStatus.totalExpense : 0,
      newIncome.total.waterDistribute + data.numberOfCard
    );

    await updateCalculatorAmount(
      db,
      batch,
      data.active,
      newStatus.totalIncome ? newStatus.totalIncome : 0
    );
    console.log("Updates completed successfully.");
  } catch (error) {
    console.error("Error in waterDistribute:", error);
  }
};

module.exports = waterDistribute;
