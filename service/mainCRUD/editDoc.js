// const admin = require("../../config/firebase-admin");

// /**
//  * Edit a document in a specified Firestore collection.
//  * @param {string} collectionName - Name of the Firestore collection.
//  * @param {string} documentId - ID of the document to edit.
//  * @param {Object} updatedData - Updated data to merge with the existing document data.
//  * @throws {Error} Throws an error if the operation fails.
//  */
// const editDocument = async (collectionName, documentId, updatedData) => {
//   if (!documentId || !updatedData || !collectionName) {
//     return null;
//   }
//   const db = admin.firestore();
//   const collection = db.collection(collectionName);

//   try {
//     if (documentId === null) {
//       console.log("documentId is null, no document updated.");
//       return; // Exit the function without performing any deletion.
//     }
//     const documentRef = collection.doc(documentId);
//     const existingData = (await documentRef.get()).data();

//     if (!existingData) {
//       throw new Error(`Document with ID ${documentId} not found.`);
//     }

//     // Merge the existing data with the updated data
//     const mergedData = {
//       ...existingData,
//       ...updatedData,
//       updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//     };

//     // Update the document with the merged data
//     await documentRef.update(mergedData);

//     console.log(
//       `Document with ID ${documentId} successfully updated in collection: ${collectionName}`
//     );
//   } catch (error) {
//     console.error(error);
//     throw new Error(
//       `Failed to edit document with ID ${documentId} in collection: ${collectionName}`
//     );
//   }
// };

// module.exports = editDocument;

const admin = require("../../config/firebase-admin");

/**
 * Edit a document in a specified Firestore collection using batch operations.
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} collectionName - Name of the Firestore collection.
 * @param {string} documentId - ID of the document to edit.
 * @param {Object} updatedData - Updated data to merge with the existing document data.
 * @throws {Error} Throws an error if the operation fails.
 */
const editDocument = async (
  db,
  batch,
  collectionName,
  documentId,
  updatedData
) => {
  if (!documentId) {
    return null;
  }

  try {
    if (!documentId) {
      console.log("documentId is null, no document updated.");
      return; // Exit the function without performing any update.
    }

    const collectionRef = db.collection(collectionName);
    const documentRef = collectionRef.doc(documentId);

    const existingDataSnapshot = await documentRef.get();
    if (!existingDataSnapshot.exists) {
      throw new Error(`Document with ID ${documentId} not found.`);
    }

    // Merge the existing data with the updated data
    const existingData = existingDataSnapshot.data();
    const mergedData = {
      ...existingData,
      ...updatedData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Add the operation to the batch
    batch.update(documentRef, mergedData);

    console.log(
      `Document with ID ${documentId} updated in collection: ${collectionName}`
    );
  } catch (error) {
    console.error(error);
    throw new Error(
      `Failed to edit document with ID ${documentId} in collection: ${collectionName}`
    );
  }
};

module.exports = editDocument;
