const updateDashboard = require("../../../../service/report/updateDashBoard/HotelProfit/updateDashboard");
const updateDashboardBranchInfo = require("../../../../service/report/updateDashBoard/HotelProfit/updateDashboardBranchInfo");
const updateCalculatorAmount = require("../../../../service/utils/updateCalculatorAmount");
const updateSheetStatus = require("../../../../service/utils/updateSheetStatus");
const updateTable = require("../../../../service/utils/updateTable");

/**
 * Update hotel profit-related data and perform necessary updates.
 *
 * @param {Object} data - The hotel profit data.
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 */
const HotelProfit = async (data, db, batch) => {
  try {
    // Creating a new credit document in the "CardFee" collection
    // First update: Change the daily table
    await updateTable(
      db,
      "tables",
      data.activeTable,
      data.deliveryguyId,
      "total",
      {
        hotelProfit: data.amount ? parseFloat(data.amount) : 0,
        total: data.amount ? parseFloat(data.amount) : 0,
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
        hotelProfit: data.amount ? parseFloat(data.amount) : 0,
        total: data.amount ? parseFloat(data.amount) : 0,
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
        hotelProfit: data.amount ? parseFloat(data.amount) : 0,
        total: data.amount ? parseFloat(data.amount) : 0,
      },
      batch
    );

    // Fourth update: Salary of the delivery guy table
    if (!newIncome) {
      throw new Error(
        "Branch summery table information is missing.Please refresh your browser and try again."
      );
    }
    // Updating sheet status with totalIncome
    const newStatus = await updateSheetStatus(
      db,
      batch,
      data.active,
      "totalIncome",
      (newIncome.total.total ? newIncome.total.total : 0) +
        (data.amount ? parseFloat(data.amount) : 0)
    );

    if (!newStatus) {
      throw new Error(
        "Branch sheet status information is missing.Please refresh your browser and try again."
      );
    }

    // Updating dashboard with newIncome and hotelProfit details
    await updateDashboard(
      db,
      batch,
      data.branchId,
      newStatus.totalIncome ? newStatus.totalIncome : 0,
      newStatus.totalExpense ? newStatus.totalExpense : 0,
      data.amount ? parseFloat(data.amount) : 0
    );

    // Updating dashboard branch information
    await updateDashboardBranchInfo(
      db,
      batch,
      data.branchId,
      newStatus.totalIncome ? newStatus.totalIncome : 0,
      newStatus.totalExpense ? newStatus.totalExpense : 0,
      (newIncome.total.hotelProfit ? newIncome.total.hotelProfit : 0) +
        (data.amount ? parseFloat(data.amount) : 0)
    );

    await updateCalculatorAmount(
      db,
      batch,
      data.active,
      newStatus.totalIncome ? newStatus.totalIncome : 0
    );
  } catch (error) {
    console.error("Error in HotelProfit:", error);
    throw error;
  }
};

module.exports = HotelProfit;
