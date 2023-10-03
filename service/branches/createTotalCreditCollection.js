// // createTotalCreditCollection.js

// const admin = require("../../config/firebase-admin");

// /**
//  * Create a TotalCredit collection if it doesn't exist.
//  * @param {string} documentId - The document ID.
//  * @returns {Promise<void>} A Promise that resolves when the operation is complete.
//  */
// const createTotalCreditCollection = async (documentId) => {
//   if (!documentId) {
//     return null;
//   }
//   const db = admin.firestore();
//   const totalCreditCollectionRef = db.collection("totalCredit").doc(documentId);
//   const totalCreditDocumentSnapshot = await totalCreditCollectionRef.get();

//   if (!totalCreditDocumentSnapshot.exists) {
//     return totalCreditCollectionRef.set({
//       CustomerCredit: 0,
//       StaffCredit: 0,
//       DailyCredit: 0,
//       total: 0,
//     });
//   }
// };

// module.exports = createTotalCreditCollection;

const createTotalCreditCollection = async (db, batch, branchId) => {
  if (!branchId) {
    return;
  }
  try {
    const totalCreditCollectionRef = db.collection("totalCredit").doc(branchId);
    const totalCreditDocumentSnapshot = await totalCreditCollectionRef.get();

    if (!totalCreditDocumentSnapshot.exists) {
      // Create initial data for the total credit collection
      const totalCreditData = {
        CustomerCredit: 0,
        StaffCredit: 0,
        DailyCredit: 0,
        total: 0,
      };

      // Add the operation to the batch
      batch.set(totalCreditCollectionRef, totalCreditData);
    }
  } catch (error) {
    console.error("Error in createTotalCreditCollection:", error);
    throw error;
  }
};

module.exports = createTotalCreditCollection;
