const getSingleDocFromCollection = require("../../../../service/utils/getSingleDocFromCollection");
const updateTable = require("../../../../service/utils/updateTable");
const updateDashboard = require("../../../../service/report/updateDashBoard/CardDistrubute/updateDashboard");
const updateDashboardBranchInfo = require("../../../../service/report/updateDashBoard/CardDistrubute/updateDashboardBranchInfo");
const updateSheetStatus = require("../../../../service/utils/updateSheetStatus");
const updateCalculatorAmount = require("../../../../service/utils/updateCalculatorAmount");
const getDocumentDataById = require("../../../../service/utils/getDocumentDataById");
const updateCreditDocument = require("../../../../service/credit/totalCredit/updateCreditDocument");
const updateCalculator = require("../../../../service/credit/updateCalculator/updateCalculator");

const CardDistribute = async (data, db, batch) => {
  try {
    const companyGain = await getSingleDocFromCollection("companyGain");
    if (!companyGain) {
      throw new Error(
        "Company gain information is missing.Please refresh your browser and try again."
      );
    }
    // First update: Change the daily table
    await updateTable(
      db,
      "tables",
      data.activeTable,
      data.deliveryguyId,
      "total",
      {
        cardDistribute: data.numberOfCard ? data.numberOfCard : 0,
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
        cardDistribute: data.numberOfCard ? data.numberOfCard : 0,
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
        cardDistribute: data.numberOfCard ? data.numberOfCard : 0,
        total:
          data.numberOfCard * companyGain.card_distribute_gain
            ? data.numberOfCard * companyGain.card_distribute_gain
            : 0,
      },
      batch
    );

    // Fourth update: Salary of the delivery guy table
    if (!newIncome) {
      throw new Error(
        "Branch summery table information is missing.Please refresh your browser and try again."
      );
    }

    const newStatus = await updateSheetStatus(
      db,
      batch,
      data.active,
      "totalIncome",
      newIncome.total.total +
        data.numberOfCard * companyGain.card_distribute_gain
        ? data.numberOfCard * companyGain.card_distribute_gain
        : 0
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
      data.numberOfCard * companyGain.card_distribute_gain
    );

    // Updating dashboard branch information
    await updateDashboardBranchInfo(
      db,
      batch,
      data.branchId,
      newStatus.totalIncome ? newStatus.totalIncome : 0,
      newStatus.totalExpense ? newStatus.totalExpense : 0,
      newIncome.total.cardDistribute + data.numberOfCard
    );

    await updateCalculatorAmount(
      db,
      batch,
      data.active,
      newStatus.totalIncome ? newStatus.totalIncome : 0
    );

    // Update the total credit by subtracting the deleted credit amount
    const updatedTotalCredit = await updateCreditDocument(
      data.branchId,
      "DailyCredit",
      -parseFloat(data ? data.amount : 0), // Subtract the deleted credit amount
      db,
      batch
    );

    // Update the calculator with the new total credit
    if (updatedTotalCredit) {
      await updateCalculator(
        data.active,
        parseFloat(updatedTotalCredit.total ? updatedTotalCredit.total : 0),
        db,
        batch
      );
    }
    console.log("Updates completed successfully.");
  } catch (error) {
    console.error("Error in CardFee:", error);
  }
};

module.exports = CardDistribute;
