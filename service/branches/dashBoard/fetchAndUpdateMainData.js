// const admin = require("../../../config/firebase-admin");
// /**
//  * Fetch and update main dashboard data with updated branches and total budget.
//  * @param {Object} data - Data for the new branch to be added.
//  * @param {number} diff - The difference in the budget.
//  * @returns {Promise<void>} A Promise that resolves when the operation is complete.
//  */
// const fetchAndUpdateMainData = async (data, branchId, newBudget) => {
//   try {
//     if (!data || !branchId || !newBudget) {
//       return null;
//     }
//     const dashboardQuerySnapshot = await admin
//       .firestore()
//       .collection("dashboard")
//       .limit(1)
//       .get();

//     if (dashboardQuerySnapshot.empty) {
//       throw new Error("Main Dashboard document not found");
//     }

//     const dashboardDocRef = dashboardQuerySnapshot.docs[0].ref;
//     const dashboardData = dashboardQuerySnapshot.docs[0].data();

//     const existingBranches = dashboardData.data || [];
//     const newTotalBudget = dashboardData.totalBudget + parseInt(newBudget);
//     const updatedBranches = existingBranches.map((branch) => {
//       if (branch.ID === branchId) {
//         return {
//           ...branch,
//           BranchName: data.name,
//         };
//       }
//       return branch;
//     });

//     await dashboardDocRef.update({
//       data: updatedBranches,
//       totalBudget: newTotalBudget,
//     });
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

// module.exports = fetchAndUpdateMainData;

// const admin = require("../../../config/firebase-admin");

/**
 * Fetch and update main dashboard data with updated branches and total budget.
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {Object} data - Data for the new branch to be added.
 * @param {string} branchId - The ID of the branch to update.
 * @param {number} newBudget - The new budget value.
 * @throws {Error} Throws an error if the operation fails.
 */
const fetchAndUpdateMainData = async (db, batch, data, branchId, newBudget) => {
  try {
    if (!data || !branchId || !newBudget) {
      return null;
    }

    const dashboardCollectionRef = db.collection("dashboard");

    const dashboardQuerySnapshot = await dashboardCollectionRef.limit(1).get();

    if (dashboardQuerySnapshot.empty) {
      throw new Error("Main Dashboard document not found");
    }

    const dashboardDocRef = dashboardQuerySnapshot.docs[0].ref;
    const dashboardData = dashboardQuerySnapshot.docs[0].data();

    const existingBranches = dashboardData.data || [];
    const newTotalBudget = dashboardData.totalBudget + parseInt(newBudget);

    // Update the branches data within the batch
    const updatedBranches = existingBranches.map((branch) => {
      if (branch.ID === branchId) {
        return {
          ...branch,
          BranchName: data.name,
        };
      }
      return branch;
    });

    console.log("updatedBranches", updatedBranches);
    // Add the operation to the batch
    batch.update(dashboardDocRef, {
      data: updatedBranches,
      totalBudget: newTotalBudget,
    });

    console.log("Main dashboard data updated successfully.");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = fetchAndUpdateMainData;
