/**
 * Update the dashboard data for a specific branch in Firestore.
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} branchId - The ID of the branch to update in the dashboard.
 * @param {number} newExpense - The new expense value to update for the branch.
 * @throws {Error} Throws an error if the update operation fails.
 */

const updateDashboardBranchInfo = async (
  db,
  batch,
  branchId,
  newExpense,
  data = {}
) => {
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

    console.log(branchId, data);
    const newData = {
      ...dashboardDataBranch[branchId],
      BranchName:
        Object.keys(data).length !== 0
          ? data.name
          : dashboardDataBranch[branchId].BranchName,
      TotalExpense: newExpense ? newExpense : 0,
      Status:
        dashboardDataBranch[branchId]["TotalProfit"] -
        (newExpense ? newExpense : 0),
    };

    const updatedData = {
      ...dashboardDataBranch,
      [branchId]: newData,
    };

    // Add the update operation to the batch
    batch.update(dashboardDocRefBranch, updatedData);
  } catch (error) {
    console.error("Error updating dashboard:", error);
    throw error; // Re-throw the error to handle it at the caller's level
  }
};

module.exports = updateDashboardBranchInfo;
