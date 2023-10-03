// const admin = require("../../config/firebase-admin");

// /**
//  * Increment a numeric field in a Firestore document by a specified value.
//  *
//  * @param {string} collectionName - Name of the Firestore collection containing the document.
//  * @param {string} documentId - ID of the Firestore document to update.
//  * @param {string} fieldToIncrement - Name of the field to increment.
//  * @param {number} value - The value to increment the field by.
//  * @returns {Promise<number|null>} A Promise that resolves with the new value of the field after incrementing, or null if the document doesn't exist.
//  * @throws {Error} Throws an error if there's an issue with the operation.
//  */
// const incrementFieldValue = async (
//   collectionName,
//   documentId,
//   fieldToIncrement,
//   value
// ) => {
//   try {
//     // Step 1: Initialize Firestore and get a reference to the document
//     const db = admin.firestore();
//     const docRef = db.collection(collectionName).doc(documentId);

//     // Step 2: Get the current value of the field
//     const docSnapshot = await docRef.get();

//     // Step 3: If the document exists, calculate the new value
//     if (docSnapshot.exists) {
//       const currentValue = docSnapshot.get(fieldToIncrement) || 0;
//       const newValue = currentValue + value;

//       // Step 4: Update the document with the new value
//       await docRef.update({
//         [fieldToIncrement]: newValue,
//       });

//       // Step 5: Return the new value after incrementing
//       return newValue;
//     }

//     // Step 6: Document doesn't exist, return null
//     return null;
//   } catch (error) {
//     // Step 7: Handle any errors that occur during the operation
//     throw error;
//   }
// };

// module.exports = incrementFieldValue;

// const admin = require("../../config/firebase-admin");

/**
 * Increment a numeric field in a Firestore document by a specified value within a batch.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} collectionName - Name of the Firestore collection containing the document.
 * @param {string} documentId - ID of the Firestore document to update.
 * @param {string} fieldToIncrement - Name of the field to increment.
 * @param {number} value - The value to increment the field by.
 * @returns {Promise<number|null>} A Promise that resolves with the new value of the field after incrementing, or null if the document doesn't exist.
 * @throws {Error} Throws an error if there's an issue with the operation.
 */
const incrementFieldValue = async (
  db,
  batch,
  collectionName,
  documentId,
  fieldToIncrement,
  value
) => {
  try {
    if (!documentId || !fieldToIncrement || !collectionName || !value) {
      return null;
    }
    // Step 1: Get a reference to the document
    const docRef = db.collection(collectionName).doc(documentId);

    // Step 2: Get the current value of the field
    const docSnapshot = await docRef.get();

    // Step 3: If the document exists, calculate the new value
    if (docSnapshot.exists) {
      const currentValue = docSnapshot.get(fieldToIncrement) || 0;
      const newValue = currentValue + value;

      // Step 4: Update the document with the new value within the batch
      batch.update(docRef, {
        [fieldToIncrement]: newValue,
      });

      // Step 5: Return the new value after incrementing
      return newValue;
    }

    // Step 6: Document doesn't exist, return null
    return null;
  } catch (error) {
    // Step 7: Handle any errors that occur during the operation
    throw error;
  }
};

module.exports = incrementFieldValue;
