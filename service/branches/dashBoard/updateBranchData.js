const updateBranchData = async (db, batch, data, branchId) => {
  try {
    if (!branchId) {
      throw new Error(
        "Unable to update branch information in dashboard because branch information is missing.Please refresh your browser and try again."
      );
    }
    const dashboardDocRefBranch = await db
      .collection("branchInfo")
      .limit(1)
      .get();

    if (dashboardDocRefBranch.empty) {
      throw new Error("Dashboard document for branch not found");
    }

    const dashboardQuerySnapshotBranch = dashboardDocRefBranch.docs[0].ref;
    const dashboardDataBranch = dashboardDocRefBranch.docs[0].data();
    const updatedData = {
      ...dashboardDataBranch,
      [branchId]: {
        BranchName: data.name, // Assuming the branch name field is "name"
        Asbeza_P: 0,
        CardDistribute: 0,
        WaterDistribute: 0,
        WifiDistribute: 0,
        HotelProfit: 0,
        TotalProfit: 0,
        TotalExpense: 0,
        Status: 0,
      },
    };

    // Add the operation to the batch
    batch.update(dashboardQuerySnapshotBranch, updatedData);
  } catch (error) {
    console.error("Error in updateBranchData:", error);
    throw error;
  }
};

module.exports = updateBranchData;
