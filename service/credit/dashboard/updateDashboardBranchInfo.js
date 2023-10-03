// const admin = require("../../../config/firebase-admin");

// /**
//  * Update the dashboard data for a specific branch in Firestore.
//  * @param {string} branchId - The ID of the branch to update in the dashboard.
//  * @param {number} totalSalary - The total salary value to update for the branch.
//  * @throws {Error} Throws an error if the update operation fails.
//  */

// const updateDashboardBranchInfo = async (branchId, newExpense) => {
//   const db = admin.firestore();

//   try {
//     if (!branchId || !newExpense) {
//       return null;
//     }
//     const dashboardQuerySnapshotBranch = await db
//       .collection("branchInfo")
//       .limit(1)
//       .get();

//     const dashboardDocRefBranch = dashboardQuerySnapshotBranch.docs[0].ref;
//     const dashboardDataBranch = dashboardQuerySnapshotBranch.docs[0].data();

//     const newData = {
//       ...dashboardDataBranch[branchId],
//       TotalExpense: newExpense,
//       Status: dashboardDataBranch[branchId]["TotalProfit"] - newExpense,
//     };

//     const updatedData = {
//       ...dashboardDataBranch,
//       [branchId]: newData,
//     };

//     await dashboardDocRefBranch.update(updatedData);

//     console.log("Dashboard updated successfully.");
//   } catch (error) {
//     console.error("Error updating dashboard:", error);
//     throw error; // Re-throw the error to handle it at the caller's level
//   }
// };

// module.exports = updateDashboardBranchInfo;

// const admin = require("../../../config/firebase-admin");

// const admin = require("../../../config/firebase-admin");

/**
 * Update the dashboard data for a specific branch in Firestore.
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} branchId - The ID of the branch to update in the dashboard.
 * @param {number} newExpense - The new expense value to update for the branch.
 * @throws {Error} Throws an error if the update operation fails.
 */

const updateDashboardBranchInfo = async (
  db,
  batch,
  branchId,
  newExpense,
  data = {}
) => {
  try {
    if (!branchId || !newExpense) {
      return null;
    }
    const dashboardQuerySnapshotBranch = await db
      .collection("branchInfo")
      .limit(1)
      .get();

    const dashboardDocRefBranch = dashboardQuerySnapshotBranch.docs[0].ref;
    const dashboardDataBranch = dashboardQuerySnapshotBranch.docs[0].data();

    const newData = {
      ...dashboardDataBranch[branchId],
      BranchName:
        Object.keys(data).length !== 0
          ? data.name
          : dashboardDataBranch[branchId].BranchName,
      TotalExpense: newExpense,
      Status: dashboardDataBranch[branchId]["TotalProfit"] - newExpense,
    };

    const updatedData = {
      ...dashboardDataBranch,
      [branchId]: newData,
    };

    // Add the update operation to the batch
    batch.update(dashboardDocRefBranch, updatedData);

    console.log("Dashboard updated successfully.");
  } catch (error) {
    console.error("Error updating dashboard:", error);
    throw error; // Re-throw the error to handle it at the caller's level
  }
};

module.exports = updateDashboardBranchInfo;
