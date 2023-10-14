// const admin = require("../../config/firebase-admin");

// const addFieldToDocument = async (
//   collectionName,
//   documentId,
//   fieldName,
//   fieldValue
// ) => {
//   const db = admin.firestore();

//   const docRef = db.collection(collectionName).doc(documentId);

//   try {
//     await docRef.update({
//       [fieldName]: fieldValue,
//     });

//     return true; // Success
//   } catch (error) {
//     console.error("Error adding field:", error);
//     throw new Error("An error occurred while adding the field.");
//   }
// };

// module.exports = addFieldToDocument;

/**
 * Function to add a field to a document within a batch.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} collectionName - Name of the Firestore collection.
 * @param {string} documentId - ID of the Firestore document.
 * @param {string} fieldName - Name of the field to add.
 * @param {string} fieldValue - The value of the field to add.
 */
const addFieldToDocument = async (
  db,
  batch,
  collectionName,
  documentId,
  fieldName,
  fieldValue
) => {
  const docRef = db.collection(collectionName).doc(documentId);

  try {
    // Add the update operation to the batch
    batch.update(docRef, {
      [fieldName]: fieldValue,
    });

    console.log(
      `Field '${fieldName}' added to the document '${documentId}' in the batch.`
    );
  } catch (error) {
    console.error("Error adding field:", error);
    throw error;
  }
};

module.exports = addFieldToDocument;
