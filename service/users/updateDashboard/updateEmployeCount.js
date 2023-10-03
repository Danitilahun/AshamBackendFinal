// const admin = require("../../../config/firebase-admin");

// /**
//  * Update the totalEmployees field in the "dashboard" Firestore document.
//  *
//  * @returns {Promise<void>} A Promise that resolves once the update is completed.
//  * @throws {Error} Throws an error if there's an issue with the operation.
//  */
// const updateDashboardTotalEmployees = async (value) => {
//   try {
//     const db = admin.firestore();

//     // Step 1: Query the "dashboard" collection
//     const dashboardQuerySnapshot = await db
//       .collection("dashboard")
//       .limit(1)
//       .get();

//     // Step 2: Check if the dashboard document exists
//     if (dashboardQuerySnapshot.empty) {
//       console.error("Dashboard document not found");
//       return;
//     }

//     // Step 3: Get the reference and data of the dashboard document
//     const dashboardDocRef = dashboardQuerySnapshot.docs[0].ref;
//     const dashboardData = dashboardQuerySnapshot.docs[0].data();

//     // Step 4: Update the totalEmployees field
//     const newEmployeeCount = dashboardData.totalEmployees + value;

//     await dashboardDocRef.update({
//       totalEmployees: newEmployeeCount,
//     });
//   } catch (error) {
//     // Step 5: Handle any errors that occur during the operation
//     console.error(error);
//     throw error;
//   }
// };

// module.exports = updateDashboardTotalEmployees;

/**
 * Update the totalEmployees field in the "dashboard" Firestore document with batch update support.
 *
 * @param {number} value - The value to update the totalEmployees field by.
 * @param {Firestore} db - Firestore database instance.
 * @param {WriteBatch} batch - Firestore batch instance.
 * @returns {Promise<void>} A Promise that resolves once the update is completed.
 * @throws {Error} Throws an error if there's an issue with the operation.
 */
const updateDashboardTotalEmployees = async (value, db, batch) => {
  try {
    // Step 1: Query the "dashboard" collection
    const dashboardQuerySnapshot = await db
      .collection("dashboard")
      .limit(1)
      .get();

    // Step 2: Check if the dashboard document exists
    if (dashboardQuerySnapshot.empty) {
      console.error("Dashboard document not found");
      return;
    }

    // Step 3: Get the reference and data of the dashboard document
    const dashboardDocRef = dashboardQuerySnapshot.docs[0].ref;
    const dashboardData = dashboardQuerySnapshot.docs[0].data();

    // Step 4: Update the totalEmployees field
    const newEmployeeCount = dashboardData.totalEmployees + value;

    // Step 5: Update the document with the new value using the batch
    batch.update(dashboardDocRef, {
      totalEmployees: newEmployeeCount,
    });
  } catch (error) {
    // Step 6: Handle any errors that occur during the operation
    console.error(error);
    throw error;
  }
};

module.exports = updateDashboardTotalEmployees;
