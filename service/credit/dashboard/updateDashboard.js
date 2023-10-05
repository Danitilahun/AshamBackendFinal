/**
 * Update the dashboard branch information in Firestore.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} branchId - The ID of the branch to update in the dashboard.
 * @param {number} newExpense - The new expense value to update for the branch.
 * @throws {Error} Throws an error if the update operation fails.
 */
const updateDashboard = async (
  db,
  batch,
  branchId,
  newExpense,
  data = {},
  difference = 0
) => {
  try {
    if (!branchId) {
      throw new Error(
        "Unable to update dashboard because branch information is missing.Please refresh your browser and try again."
      );
    }
    const dashboardQuerySnapshot = await db
      .collection("dashboard")
      .limit(1)
      .get();

    const dashboardDocRef = dashboardQuerySnapshot.docs[0].ref;
    const dashboardData = dashboardQuerySnapshot.docs[0].data();

    const existingBranches = dashboardData.data || [];
    const newTotalBudget = dashboardData.totalBudget + parseInt(difference);
    const updatedBranches = existingBranches.map((branch) => {
      if (branch.ID === branchId) {
        return {
          ...branch,
          BranchName:
            Object.keys(data).length !== 0 ? data.name : branch.BranchName,
          BranchExpense: newExpense ? newExpense : 0,
        };
      }
      return branch;
    });

    let totalExpense = 0;
    for (const obj of updatedBranches) {
      totalExpense += obj.BranchExpense;
    }

    // Add the update operation to the batch
    batch.update(dashboardDocRef, {
      totalExpense: totalExpense,
      data: updatedBranches,
      totalBudget: newTotalBudget,
    });

    console.log("Dashboard branch information updated successfully.");
  } catch (error) {
    console.error("Error updating dashboard branch information:", error);
    throw error; // Re-throw the error to handle it at the caller's level
  }
};

module.exports = updateDashboard;
