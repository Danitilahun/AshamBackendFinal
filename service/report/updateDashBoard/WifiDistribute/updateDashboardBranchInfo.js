/**
 * Update the dashboard data for a specific branch in Firestore.
 *
 * @param {import('firebase-admin').firestore.Firestore} db - The Firestore database instance.
 * @param {import('firebase-admin').firestore.WriteBatch} batch - The Firestore batch.
 * @param {string} branchId - The ID of the branch to update in the dashboard.
 * @param {number} totalIncome - The total income value for the branch.
 * @param {number} totalSalary - The total salary value for the branch.
 * @param {number} wifiDistribute - The Wifi distribution value for the branch.
 * @throws {Error} Throws an error if the update operation fails.
 */
const updateDashboardBranchInfo = async (
  db,
  batch,
  branchId,
  totalIncome,
  totalSalary,
  wifiDistribute
) => {
  try {
    if (!branchId) {
      throw new Error(
        "Unable to update dashboard because branch information is missing.Please refresh your browser and try again."
      );
    }
    // Retrieve the dashboard data for the branch
    const dashboardQuerySnapshotBranch = await db
      .collection("branchInfo")
      .limit(1)
      .get();
    // Get reference and current data of the dashboard
    const dashboardDocRefBranch = dashboardQuerySnapshotBranch.docs[0].ref;
    const dashboardDataBranch = dashboardQuerySnapshotBranch.docs[0].data();
    // Create the updated data for the specific branch
    const newData = {
      ...dashboardDataBranch[branchId],
      WifiDistribute: parseFloat(wifiDistribute),
      TotalExpense: parseFloat(totalSalary),
      TotalProfit: parseFloat(totalIncome),
      Status: parseFloat(totalIncome) - parseFloat(totalSalary),
    };
    // Create the updated data for the entire dashboard
    const updatedData = {
      ...dashboardDataBranch,
      [branchId]: newData,
    };
    // Update the Firestore document with the new data
    batch.update(dashboardDocRefBranch, updatedData);
    console.log("Dashboard updated successfully.");
  } catch (error) {
    console.error("Error updating dashboard:", error);
    throw error; // Re-throw the error to handle it at the caller's level
  }
};

module.exports = updateDashboardBranchInfo;
