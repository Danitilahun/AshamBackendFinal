const admin = require("../../../config/firebase-admin");

/**
 * Update the dashboard branch information in Firestore.
 *
 * @param {string} branchId - The ID of the branch to update in the dashboard.
 * @param {number} totalIncome - The total income value to update for the branch.
 * @param {number} totalSalary - The total salary value to update for the branch.
 * @throws {Error} Throws an error if the update operation fails.
 */
const updateDashboard = async (
  branchId,
  totalIncome,
  totalSalary,
  newCardIncome
) => {
  const db = admin.firestore();

  try {
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
          BranchIncome: parseInt(totalIncome),
          BranchExpense: parseInt(totalSalary),
        };
      }
      return branch;
    });

    const updatedBranches2 = existingBranches2.map((branch) => {
      if (branch.Name === "Card") {
        return {
          ...branch,
          Amount: branch.Amount + newCardIncome,
        };
      }
      return branch;
    });

    let totalBIncome = 0;
    let totalExpense = 0;

    for (const obj of updatedBranches) {
      totalBIncome += parseInt(obj.BranchIncome);
      totalExpense += parseInt(obj.BranchExpense);
    }

    await dashboardDocRef.update({
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
