/**
 * Update the dashboard branch information in Firestore within a batch operation.
 *
 * @param {Firestore} db - The Firestore database instance.
 * @param {WriteBatch} batch - The Firestore batch to which the updates should be added.
 * @param {string} branchId - The ID of the branch to update in the dashboard.
 * @param {number} totalIncome - The total income value to update for the branch.
 * @param {number} totalBExpense - The total expense value to update for the branch.
 * @param {number} newAsbezaGain - The new Asbeza gain value to update.
 * @throws {Error} Throws an error if the update operation fails.
 */
const updateDashboard = async (
  db,
  batch,
  branchId,
  totalIncome,
  totalBExpense,
  newAsbezaGain
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
    const existingBranches2 = dashboardData.data2 || [];

    const updatedBranches = existingBranches.map((branch) => {
      if (branch.ID === branchId) {
        return {
          ...branch,
          BranchIncome: parseFloat(totalIncome),
          BranchExpense: parseFloat(totalBExpense),
        };
      }
      return branch;
    });

    const updatedBranches2 = existingBranches2.map((branch) => {
      if (branch.Name === "Asbeza") {
        return {
          ...branch,
          Amount: parseFloat(branch.Amount) + parseFloat(newAsbezaGain),
        };
      }
      return branch;
    });

    let totalBIncome = 0;
    let totalExpense = 0;

    for (const obj of updatedBranches) {
      totalBIncome += parseFloat(obj.BranchIncome);
      totalExpense += parseFloat(obj.BranchExpense);
    }

    batch.update(dashboardDocRef, {
      totalIncome: totalBIncome,
      totalExpense: totalExpense,
      data: updatedBranches,
      data2: updatedBranches2,
    });

    console.log("Dashboard branch information updated successfully.");
  } catch (error) {
    console.error("Error updating dashboard branch information:", error);
    throw error; // Re-throw the error to handle it at the caller's level
  }
};

module.exports = updateDashboard;
