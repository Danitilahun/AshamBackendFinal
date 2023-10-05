/**
 * Update the dashboard data for a specific branch in Firestore using a batch.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} branchId - The ID of the branch to update in the dashboard.
 * @param {number} totalIncome - The total income value for the branch.
 * @param {number} totalExpense - The total expense value for the branch.
 * @param {number} hotelProfit - The hotel profit value for the branch.
 * @throws {Error} Throws an error if the update operation fails.
 */
const updateDashboardBranchInfo = async (
  db,
  batch,
  branchId,
  totalIncome,
  totalExpense,
  hotelProfit
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
      HotelProfit: parseFloat(hotelProfit),
      TotalProfit: parseFloat(totalIncome),
      TotalExpense: parseFloat(totalExpense),
      Status: parseFloat(totalIncome) - parseFloat(totalExpense),
    };

    // Create the updated data for the entire dashboard
    const updatedData = {
      ...dashboardDataBranch,
      [branchId]: newData,
    };

    // Update the Firestore document with the new data within the batch
    batch.update(dashboardDocRefBranch, updatedData);

    console.log("Dashboard updated successfully.");
  } catch (error) {
    console.error("Error updating dashboard:", error);
    throw error; // Re-throw the error to handle it at the caller's level
  }
};

module.exports = updateDashboardBranchInfo;
