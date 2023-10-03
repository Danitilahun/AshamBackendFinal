const updateDashboard = require("../../credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../credit/dashboard/updateDashboardBranchInfo");
const updateSheetStatus = require("../../credit/updateSheetStatus/updateSheetStatus");
const getSingleDocFromCollection = require("../../utils/getSingleDocFromCollection");
const updateTable = require("../../utils/updateTable");

const payDailySalary = async (active, id, branchId, db, batch, credit) => {
  try {
    const Price = await getSingleDocFromCollection("prices");

    const newSalaryTable = await updateTable(
      db,
      "salary",
      active,
      id,
      "total",
      {
        fixedSalary: Price.fixedSalary,
        total: Price.fixedSalary,
      },
      batch
    );

    console.log(newSalaryTable.total.total, Price.fixedSalary);
    const newStatus = await updateSheetStatus(
      active,
      "totalDeliveryGuySalary",
      newSalaryTable.total.total + Price.fixedSalary - credit,
      db,
      batch
    );

    console.log(newStatus);
    await updateDashboard(db, batch, branchId, newStatus.totalExpense);
    await updateDashboardBranchInfo(
      db,
      batch,
      branchId,
      newStatus.totalExpense
    );
  } catch (error) {
    throw new Error(`Error updating salary data: ${error.message}`);
  }
};

module.exports = payDailySalary;
