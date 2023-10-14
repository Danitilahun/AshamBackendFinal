// const admin = require("../../config/firebase-admin");
// const updateDashboardTotalCustomer = async (value) => {
//   try {
//     const db = admin.firestore();
//     const dashboardQuerySnapshot = await db
//       .collection("dashboard")
//       .limit(1)
//       .get();

//     if (!dashboardQuerySnapshot.empty) {
//       const dashboardDocRef = dashboardQuerySnapshot.docs[0].ref;
//       const dashboardData = dashboardQuerySnapshot.docs[0].data();

//       // Update the existing branches data with the new branch
//       const newEmployee = dashboardData.totalCustomer + value;
//       await dashboardDocRef.update({
//         totalCustomer: newEmployee,
//       });
//     }
//   } catch (error) {
//     console.error("Error updating dashboard totalCustomer:", error);
//   }
// };

// module.exports = updateDashboardTotalCustomer;

const admin = require("../../config/firebase-admin");

/**
 * Update the totalCustomer field in the "dashboard" collection using a batch write.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch instance.
 * @param {number} value - The value to add to the totalCustomer field.
 */
const updateDashboardTotalCustomer = async (db, batch, value) => {
  try {
    const dashboardCollectionRef = db.collection("dashboard").limit(1);
    const dashboardQuerySnapshot = await dashboardCollectionRef.get();

    if (!dashboardQuerySnapshot.empty) {
      const dashboardDocRef = dashboardQuerySnapshot.docs[0].ref;
      const dashboardData = dashboardQuerySnapshot.docs[0].data();

      const newTotalCustomer = dashboardData.totalCustomer + value;

      // Add the update operation to the batch
      batch.update(dashboardDocRef, { totalCustomer: newTotalCustomer });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = updateDashboardTotalCustomer;
