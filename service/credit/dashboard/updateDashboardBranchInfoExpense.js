// const admin = require("../../../config/firebase-admin");

/**
 * Update the dashboard data for a specific branch in Firestore.
 * @param {string} branchId - The ID of the branch to update in the dashboard.
 * @param {number} newExpense - The new total expense value for the branch.
 * @param {import('firebase-admin').firestore.Firestore} db - The Firestore database instance.
 * @param {import('firebase-admin').firestore.WriteBatch} batch - The Firestore write batch.
 * @throws {Error} Throws an error if the update operation fails.
 */

const updateDashboardBranchInfo = async (branchId, newExpense, db, batch) => {
  try {
    if (!branchId) {
      throw new Error(
        "Unable to update dashboard because branch information is missing.Please refresh your browser and try again."
      );
    }
    const dashboardQuerySnapshotBranch = await db
      .collection("branchInfo")
      .limit(1)
      .get();

    const dashboardDocRefBranch = dashboardQuerySnapshotBranch.docs[0].ref;
    const dashboardDataBranch = dashboardQuerySnapshotBranch.docs[0].data();

    const newData = {
      ...dashboardDataBranch[branchId],
      TotalExpense: newExpense,
      Status: dashboardDataBranch[branchId]["TotalProfit"] - newExpense,
    };

    const updatedData = {
      ...dashboardDataBranch,
      [branchId]: newData,
    };

    await batch.update(dashboardDocRefBranch, updatedData);
  } catch (error) {
    console.error("Error updating dashboard:", error);
    throw error; // Re-throw the error to handle it at the caller's level
  }
};

module.exports = updateDashboardBranchInfo;
