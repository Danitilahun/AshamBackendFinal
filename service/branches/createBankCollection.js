// // createBankCollection.js
// const admin = require("../../config/firebase-admin");

// /**
//  * Create a Bank collection if it doesn't exist.
//  * @param {string} documentId - The document ID.
//  * @returns {Promise<void>} A Promise that resolves when the operation is complete.
//  */
// const createBankCollection = async (documentId) => {
//   const db = admin.firestore();
//   const bankCollectionRef = db.collection("Bank").doc(documentId);
//   const bankDocumentSnapshot = await bankCollectionRef.get();

//   if (!bankDocumentSnapshot.exists) {
//     return bankCollectionRef.set({
//       withdrawal: 0,
//       deposit: 0,
//       total: 0,
//     });
//   }
// };

// module.exports = createBankCollection;

const createBankCollection = async (db, batch, branchId) => {
  try {
    if (!branchId) {
      throw new Error(
        "Unable to create bank collection because branch information is missing.Please refresh your browser and try again."
      );
    }
    const bankCollectionRef = db.collection("Bank").doc(branchId);
    const bankDocumentSnapshot = await bankCollectionRef.get();

    if (!bankDocumentSnapshot.exists) {
      // Create initial data for the bank collection
      const bankData = {
        Withdraw: 0,
        Deposit: 0,
        total: 0,
      };

      // Add the operation to the batch
      batch.set(bankCollectionRef, bankData);
      console.log("Bank collection created successfully.");
    } else {
      console.log("Bank collection already exists.");
    }

    // Handle other logic here if needed...
  } catch (error) {
    // Handle errors here, you can log or throw the error as needed
    console.error("Error in createBankCollection:", error);
    throw error; // You can rethrow the error to propagate it up the call stack
  }
};
