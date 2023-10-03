const getSingleDocFromCollection = require("../../../../service/utils/getSingleDocFromCollection");
const updateTable = require("../../../../service/utils/updateTable");
const updateDashboard = require("../../../../service/report/updateDashBoard/CardDistrubute/updateDashboard");
const updateDashboardBranchInfo = require("../../../../service/report/updateDashBoard/CardDistrubute/updateDashboardBranchInfo");
const updateSheetStatus = require("../../../../service/utils/updateSheetStatus");
const updateCalculatorAmount = require("../../../../service/utils/updateCalculatorAmount");
const getDocumentDataById = require("../../../../service/utils/getDocumentDataById");

const CardDistribute = async (data, db, batch) => {
  try {
    if (!data) {
      console.error("CardDistribute: Data is missing or null.");
      return;
    }

    const companyGain = await getSingleDocFromCollection("companyGain");
    // First update: Change the daily table
    await updateTable(
      db,
      "tables",
      data.activeTable,
      data.deliveryguyId,
      "total",
      {
        cardDistribute: data.numberOfCard,
        total: data.numberOfCard * companyGain.card_distribute_gain,
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
        cardDistribute: data.numberOfCard,
        total: data.numberOfCard * companyGain.card_distribute_gain,
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
        cardDistribute: data.numberOfCard,
        total: data.numberOfCard * companyGain.card_distribute_gain,
      },
      batch
    );

    // Fourth update: Salary of the delivery guy table

    const newStatus = await updateSheetStatus(
      db,
      batch,
      data.active,
      "totalIncome",
      newIncome.total.total +
        data.numberOfCard * companyGain.card_distribute_gain
    );

    console.log(newStatus);
    // Updating dashboard with newIncome and newSalaryExpense details
    await updateDashboard(
      db,
      batch,
      data.branchId,
      newStatus.totalIncome,
      newStatus.totalExpense,
      data.numberOfCard * companyGain.card_distribute_gain
    );

    // Updating dashboard branch information
    await updateDashboardBranchInfo(
      db,
      batch,
      data.branchId,
      newStatus.totalIncome,
      newStatus.totalExpense,
      newIncome.total.cardDistribute + data.numberOfCard
    );

    await updateCalculatorAmount(db, batch, data.active, newStatus.totalIncome);
    console.log("Updates completed successfully.");
  } catch (error) {
    console.error("Error in CardFee:", error);
  }
};

module.exports = CardDistribute;
