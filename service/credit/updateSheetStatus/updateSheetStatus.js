// const admin = require("../../../config/firebase-admin");

// /**
//  * Update a document in the "Status" collection in Firestore.
//  *
//  * @param {string} customId - The custom ID of the document to update.
//  * @param {string} expenseType - The type of expense field to update.
//  * @param {number} value - The value to set for the specified expense field.
//  * @returns {Promise<Object|null>} A Promise that resolves to the updated data object if successful, or null if the document doesn't exist.
//  * @throws {Error} Throws an error if the update operation fails.
//  */
// const updateSheetStatus = async (customId, expenseType, value) => {
//   const db = admin.firestore();

//   const creditRef = db.collection("Status").doc(customId);

//   try {
//     // Check if the document exists
//     const creditDoc = await creditRef.get();

//     if (creditDoc.exists) {
//       const updateData = {};
//       updateData[expenseType] = value;
//       updateData["totalExpense"] =
//         creditDoc.get("totalExpense") - creditDoc.get(expenseType) + value;
//       await creditRef.update(updateData);

//       // Retrieve the updated document
//       const updatedCreditDoc = await creditRef.get();

//       // Return the updated data
//       return updatedCreditDoc.data();
//     }

//     return null;
//   } catch (error) {
//     console.error("Error updating sheet status:", error);
//     throw error; // Re-throw the error to handle it at the caller's level
//   }
// };

// module.exports = updateSheetStatus;

/**
 * Update a document in the "Status" collection in Firestore.
 *
 * @param {string} customId - The custom ID of the document to update.
 * @param {string} expenseType - The type of expense field to update.
 * @param {number} value - The value to set for the specified expense field.
 * @param {admin.firestore.Firestore} db - Firestore database instance.
 * @param {admin.firestore.WriteBatch} batch - Firestore batch instance.
 * @returns {Promise<Object|null>} A Promise that resolves to the updated data object if successful, or null if the document doesn't exist.
 * @throws {Error} Throws an error if the update operation fails.
 */
const updateSheetStatus = async (customId, expenseType, value, db, batch) => {
  try {
    if (!db) {
      throw new Error("Firestore database instance is required.");
    }

    // Get the document reference from the "Status" collection
    const creditRef = db.collection("Status").doc(customId);

    // Initialize batch to perform atomic updates
    if (!batch) {
      batch = db.batch();
    }

    // Check if the document exists
    const creditDoc = await creditRef.get();

    if (creditDoc.exists) {
      const updateData = {};
      updateData[expenseType] = value;
      updateData["totalExpense"] =
        creditDoc.get("totalExpense") - creditDoc.get(expenseType) + value;

      // Update the document data without committing the batch
      batch.update(creditRef, updateData);

      return updateData;
    }

    return null;
  } catch (error) {
    console.error("Error updating sheet status:", error);
    throw error; // Re-throw the error to handle it at the caller's level
  }
};

module.exports = updateSheetStatus;
