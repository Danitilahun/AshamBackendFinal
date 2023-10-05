// const admin = require("../../../config/firebase-admin");

// const deleteFieldFromDashboardDataBranch = async (branchIdToDelete) => {
//   try {
//     if (!branchIdToDelete) {
//       return null;
//     }
//     const db = admin.firestore();

//     const dashboardQuerySnapshotBranch = await db
//       .collection("branchInfo")
//       .limit(1)
//       .get();

//     if (dashboardQuerySnapshotBranch.empty) {
//       throw new Error("Dashboard document for branch not found");
//     }

//     const dashboardDocRefBranch = dashboardQuerySnapshotBranch.docs[0].ref;
//     const dashboardDataBranch = dashboardQuerySnapshotBranch.docs[0].data();

//     // Remove the specified branchIdToDelete field from dashboardDataBranch
//     delete dashboardDataBranch[branchIdToDelete];

//     // Check if there are remaining fields in dashboardDataBranch
//     const hasRemainingFields = Object.keys(dashboardDataBranch).length > 0;

//     if (hasRemainingFields) {
//       console.log("dashboardDataBranch", dashboardDataBranch);
//       // Update the dashboard document with the updated data
//       await dashboardDocRefBranch.set(dashboardDataBranch);
//     } else {
//       // If there are no remaining fields, set the document to an empty object
//       await dashboardDocRefBranch.set({});
//     }
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

// module.exports = deleteFieldFromDashboardDataBranch;

const deleteFieldFromDashboardDataBranch = async (
  db,
  batch,
  branchIdToDelete
) => {
  try {
    if (!branchIdToDelete) {
      throw new Error(
        "Unable to delete branch information from dashboard because branch information is missing.Please refresh your browser and try again."
      );
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

    // Remove the specified branchIdToDelete field from dashboardDataBranch
    delete dashboardDataBranch[branchIdToDelete];

    batch.set(
      dashboardDocRefBranch,
      dashboardDataBranch ? dashboardDataBranch : {}
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = deleteFieldFromDashboardDataBranch;
