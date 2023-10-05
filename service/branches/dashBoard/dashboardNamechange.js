const admin = require("../../../config/firebase-admin");
/**
 * Fetch and update main dashboard data with updated branches and total budget.
 * @param {Object} data - Data for the new branch to be added.
 * @param {number} diff - The difference in the budget.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
const UpdateMainData = async (data, branchId, newBudget) => {
  try {
    if (!branchId) {
      throw new Error(
        "Unable to update dashboard: branch information is missing.Please refresh your browser and try again."
      );
    }
    const dashboardQuerySnapshot = await admin
      .firestore()
      .collection("dashboard")
      .limit(1)
      .get();

    if (dashboardQuerySnapshot.empty) {
      throw new Error("Main Dashboard document not found");
    }

    const dashboardDocRef = dashboardQuerySnapshot.docs[0].ref;
    const dashboardData = dashboardQuerySnapshot.docs[0].data();

    const existingBranches = dashboardData.data || [];
    const newTotalBudget = dashboardData.totalBudget + parseFloat(newBudget);
    const updatedBranches = existingBranches.map((branch) => {
      if (branch.ID === branchId) {
        return {
          ...branch,
          BranchName: data.name,
        };
      }
      return branch;
    });

    await dashboardDocRef.update({
      data: updatedBranches,
      totalBudget: newTotalBudget,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = UpdateMainData;
