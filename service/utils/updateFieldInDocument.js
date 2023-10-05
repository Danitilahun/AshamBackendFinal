// const admin = require("../../config/firebase-admin");
// /**
//  * Update a specific field of a document by ID in a Firestore collection.
//  *
//  * @param {string} collectionName - Name of the Firestore collection.
//  * @param {string} documentId - ID of the document to update.
//  * @param {string} fieldName - Name of the field to update.
//  * @param {any} newValue - New value to set for the field.
//  * @returns {Promise<void>} - A promise that resolves when the field is updated successfully.
//  * @throws {Error} Throws an error if the operation fails.
//  */
// const updateFieldInDocument = async (
//   collectionName,
//   documentId,
//   fieldName,
//   newValue
// ) => {
//   const db = admin.firestore();
//   const documentRef = db.collection(collectionName).doc(documentId);

//   try {
//     const documentSnapshot = await documentRef.get();

//     if (documentSnapshot.exists) {
//       // Update the specific field
//       await documentRef.update({
//         [fieldName]: newValue,
//       });

//       console.log(`Document ${documentId} updated successfully.`);
//     } else {
//       console.log(`Document ${documentId} not found.`);
//     }
//   } catch (error) {
//     console.error("Error updating document:", error);
//     throw new Error("Failed to update field in document.");
//   }
// };

// module.exports = updateFieldInDocument;

// const admin = require("../../config/firebase-admin");

/**
 * Update a specific field of a document by ID in a Firestore collection.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch instance.
 * @param {string} collectionName - Name of the Firestore collection.
 * @param {string} documentId - ID of the document to update.
 * @param {string} fieldName - Name of the field to update.
 * @param {any} newValue - New value to set for the field.
 * @returns {Promise<void>} - A promise that resolves when the field is updated successfully.
 * @throws {Error} Throws an error if the operation fails.
 */
const updateFieldInDocument = async (
  db,
  batch,
  collectionName,
  documentId,
  fieldName,
  newValue
) => {
  if (!documentId) {
    return;
  }
  const documentRef = db.collection(collectionName).doc(documentId);

  try {
    const documentSnapshot = await documentRef.get();

    if (documentSnapshot.exists) {
      // Update the specific field
      batch.update(documentRef, {
        [fieldName]: newValue,
      });

      console.log(`Document ${documentId} updated successfully.`);
    } else {
      console.log(`Document ${documentId} not found.`);
    }
  } catch (error) {
    console.error("Error updating document:", error);
    throw new Error("Failed to update field in document.");
  }
};

module.exports = updateFieldInDocument;
