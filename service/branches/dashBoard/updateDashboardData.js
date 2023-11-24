const updateDashboardData = async (db, batch, data, branchId) => {
  try {
    if (!branchId) {
      throw new Error(
        "Unable to update branch information in dashboard because branch information is missing.Please refresh your browser and try again."
      );
    }
    const dashboardDocRef = await db.collection("dashboard").limit(1).get();

    if (dashboardDocRef.empty) {
      throw new Error("Main Dashboard document not found");
    }

    const dashboardQuerySnapshot = dashboardDocRef.docs[0].ref;
    const dashboardData = dashboardDocRef.docs[0].data();
    const newTotalBudget = dashboardData.totalBudget + parseInt(data.budget);

    const existingBranches = dashboardData.data || [];

    const newBranch = {
      BranchName: data.name,
      ID: branchId,
      uniqueName: data.uniqueName,
      BranchIncome: 0,
      BranchExpense: 0,
    };

    existingBranches.push(newBranch);
    // Add the operation to the batch
    batch.update(dashboardQuerySnapshot, {
      totalBudget: newTotalBudget,
      data: existingBranches,
    });
  } catch (error) {
    console.error("Error in updateDashboardData:", error);
    throw error;
  }
};

module.exports = updateDashboardData;
