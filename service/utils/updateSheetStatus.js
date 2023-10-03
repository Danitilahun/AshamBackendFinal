// const admin = require("../../config/firebase-admin");

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
//       updateData[expenseType] = parseInt(value);
//       if (expenseType !== "totalIncome") {
//         updateData["totalExpense"] =
//           creditDoc.get("totalExpense") - creditDoc.get(expenseType) + value;
//       } else {
//         updateData["totaltax"] =
//           parseInt(value) * parseInt(creditDoc.get("taxPersentage")) * 0.01;
//         updateData["totalExpense"] =
//           parseInt(creditDoc.get("totalExpense")) +
//           updateData["totaltax"] -
//           parseInt(creditDoc.get("totaltax"));
//       }

//       console.log(updateData);
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
 * Update a document in the "Status" collection in Firestore using a batch.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} customId - The custom ID of the document to update.
 * @param {string} expenseType - The type of expense field to update.
 * @param {number} value - The value to set for the specified expense field.
 * @returns {Promise<Object|null>} A Promise that resolves to the updated data object if successful, or null if the document doesn't exist.
 * @throws {Error} Throws an error if the update operation fails.
 */
const updateSheetStatus = async (db, batch, customId, expenseType, value) => {
  const creditRef = db.collection("Status").doc(customId);

  try {
    // Check if the document exists
    const creditDoc = await creditRef.get();

    if (creditDoc.exists) {
      const updateData = {};
      updateData[expenseType] = parseInt(value);
      if (expenseType !== "totalIncome") {
        updateData["totalExpense"] =
          creditDoc.get("totalExpense") - creditDoc.get(expenseType) + value;
      } else {
        updateData["totaltax"] =
          parseInt(value) * parseInt(creditDoc.get("taxPersentage")) * 0.01;
        updateData["totalExpense"] =
          parseInt(creditDoc.get("totalExpense")) +
          updateData["totaltax"] -
          parseInt(creditDoc.get("totaltax"));
      }

      batch.update(creditRef, updateData);

      // Return the updated data
      return updateData;
    }

    return null;
  } catch (error) {
    console.error("Error updating sheet status:", error);
    throw error; // Re-throw the error to handle it at the caller's level
  }
};

module.exports = updateSheetStatus;
