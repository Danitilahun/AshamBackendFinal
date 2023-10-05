// const admin = require("../../config/firebase-admin");
// /**
//  * Updates or creates fields in a Firestore document.
//  *
//  * @param {string} collectionName - Name of the Firestore collection.
//  * @param {string} documentId - ID of the document to update or create.
//  * @param {object} newData - Data to update or create in the document.
//  * @returns {Promise<object>} The updated document data.
//  * @throws {Error} Throws an error if the operation fails.
//  */
// const updateOrCreateFieldsInDocument = async (
//   collectionName,
//   documentId,
//   newData
// ) => {
//   try {
//     if (!documentId) {
//       return null;
//     }
//     // Get a reference to Firestore
//     const firestore = admin.firestore();

//     // Get the document reference
//     const documentRef = firestore.collection(collectionName).doc(documentId);

//     // Get the current data of the document
//     const documentSnapshot = await documentRef.get();

//     if (!documentSnapshot.exists) {
//       // No document found, it will be created
//       console.log("Document not found; creating a new one.");
//     }

//     // Merge the new data with the existing document data
//     await documentRef.set(
//       { ...documentSnapshot.data(), ...newData },
//       { merge: true }
//     );

//     // Return the updated document data
//     return { ...documentSnapshot.data(), ...newData };
//   } catch (error) {
//     throw new Error(`Error getting/updating document: ${error.message}`);
//   }
// };

// module.exports = updateOrCreateFieldsInDocument;

// const admin = require("../../config/firebase-admin");

/**
 * Updates or creates fields in a Firestore document.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} collectionName - Name of the Firestore collection.
 * @param {string} documentId - ID of the document to update or create.
 * @param {object} newData - Data to update or create in the document.
 * @returns {Promise<object>} The updated document data.
 * @throws {Error} Throws an error if the operation fails.
 */
const updateOrCreateFieldsInDocument = async (
  db,
  batch,
  collectionName,
  documentId,
  newData
) => {
  try {
    if (!documentId) {
      throw new Error(
        `unable to update ${collectionName}, something is missing.Please refresh your browser and try again.`
      );
    }
    // Get the document reference
    const documentRef = db.collection(collectionName).doc(documentId);

    // Get the current data of the document
    const documentSnapshot = await documentRef.get();

    if (!documentSnapshot.exists) {
      // No document found, it will be created
      console.log("Document not found; creating a new one.");
    }

    // Merge the new data with the existing document data
    batch.set(
      documentRef,
      { ...documentSnapshot.data(), ...newData },
      { merge: true }
    );

    // Return the updated document data
    return { ...documentSnapshot.data(), ...newData };
  } catch (error) {
    throw new Error(`Error getting/updating document: ${error.message}`);
  }
};

module.exports = updateOrCreateFieldsInDocument;
