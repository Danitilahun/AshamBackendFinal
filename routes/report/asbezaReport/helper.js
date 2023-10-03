const updateDashboard = require("../../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../../service/credit/dashboard/updateDashboardBranchInfo");

const updateDashboardAndBranchInfo = async (
  branchId,
  totalExpense,
  db,
  batch
) => {
  try {
    // Update the dashboard with the new status
    await updateDashboard(db, batch, branchId, totalExpense);

    // Update dashboard branch info with the new status
    await updateDashboardBranchInfo(db, batch, branchId, totalExpense);

    // Both updates were successful
    console.log("Dashboard and branch info updated successfully");
  } catch (error) {
    // Handle errors here
    console.error("Error updating dashboard and branch info:", error);
  }
};

module.exports = updateDashboardAndBranchInfo;
