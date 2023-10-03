const admin = require("../../../config/firebase-admin");
/**
 * Fetch and update branch-specific data in the dashboard.
 * @param {string} id - ID of the branch-specific data to be updated.
 * @param {Object} data - Data to update the branch-specific data.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
const UpdateBranchData = async (id, data) => {
  if (!id || !data) {
    return null;
  }
  try {
    const dashboardQuerySnapshotBranch = await admin
      .firestore()
      .collection("branchInfo")
      .limit(1)
      .get();

    if (dashboardQuerySnapshotBranch.empty) {
      throw new Error("Dashboard document for branch not found");
    }

    const dashboardDocRefBranch = dashboardQuerySnapshotBranch.docs[0].ref;
    const dashboardDataBranch = dashboardQuerySnapshotBranch.docs[0].data();

    const newData = { ...dashboardDataBranch[id], BranchName: data.name };

    const updatedData = {
      ...dashboardDataBranch,
      [id]: newData,
    };

    await dashboardDocRefBranch.update(updatedData);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = UpdateBranchData;
