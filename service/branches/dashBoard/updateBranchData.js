// // updateBranchData.js

// const admin = require("../../../config/firebase-admin");

// /**
//  * Update the branch-specific data in the dashboard.
//  * @param {Object} data - Data to be added for the new branch.
//  * @param {string} newBranchRefId - The ID of the new branch.
//  * @returns {Promise<void>} A Promise that resolves when the operation is complete.
//  */
// const updateBranchData = async (data, newBranchRefId) => {
//   if (!newBranchRefId) {
//     return null;
//   }
//   try {
//     const dashboardDocRefBranch = await admin
//       .firestore()
//       .collection("branchInfo")
//       .limit(1)
//       .get();

//     if (dashboardDocRefBranch.empty) {
//       throw new Error("Dashboard document for branch not found");
//     }

//     const dashboardQuerySnapshotBranch = dashboardDocRefBranch.docs[0].ref;
//     const dashboardDataBranch = dashboardDocRefBranch.docs[0].data();
//     const updatedData = {
//       ...dashboardDataBranch,
//       [newBranchRefId]: {
//         BranchName: data.name, // Assuming the branch name field is "name"
//         Asbeza_P: 0,
//         CardDistribute: 0,
//         WaterDistribute: 0,
//         WifiDistribute: 0,
//         HotelProfit: 0,
//         TotalProfit: 0,
//         TotalExpense: 0,
//         Status: 0,
//       },
//     };

//     await dashboardQuerySnapshotBranch.update(updatedData);
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

// module.exports = updateBranchData;

const updateBranchData = async (db, batch, data, branchId) => {
  if (!branchId) {
    return;
  }
  try {
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
