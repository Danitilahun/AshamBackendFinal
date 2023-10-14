// const admin = require("../../../config/firebase-admin");
// /**
//  * Fetch and update branch-specific data in the dashboard.
//  * @param {string} id - ID of the branch-specific data to be updated.
//  * @param {Object} data - Data to update the branch-specific data.
//  * @returns {Promise<void>} A Promise that resolves when the operation is complete.
//  */
// const fetchAndUpdateBranchData = async (id, data) => {
//   if (!id || !data) {
//     return null;
//   }
//   try {
//     const dashboardQuerySnapshotBranch = await admin
//       .firestore()
//       .collection("branchInfo")
//       .limit(1)
//       .get();

//     if (dashboardQuerySnapshotBranch.empty) {
//       throw new Error("Dashboard document for branch not found");
//     }

//     const dashboardDocRefBranch = dashboardQuerySnapshotBranch.docs[0].ref;
//     const dashboardDataBranch = dashboardQuerySnapshotBranch.docs[0].data();

//     const newData = { ...dashboardDataBranch[id], BranchName: data.name };

//     const updatedData = {
//       ...dashboardDataBranch,
//       [id]: newData,
//     };

//     await dashboardDocRefBranch.update(updatedData);
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

// module.exports = fetchAndUpdateBranchData;

// const admin = require("../../../config/firebase-admin");

/**
 * Fetch and update branch-specific data in the dashboard.
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} id - ID of the branch-specific data to be updated.
 * @param {Object} data - Data to update the branch-specific data.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
const fetchAndUpdateBranchData = async (db, batch, id, data) => {
  try {
    if (!id || !data) {
      return null;
    }
    const dashboardQuerySnapshotBranch = await db
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

    console.log("branchData", updatedData);
    // Add the operation to the batch
    batch.update(dashboardDocRefBranch, updatedData);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = fetchAndUpdateBranchData;
