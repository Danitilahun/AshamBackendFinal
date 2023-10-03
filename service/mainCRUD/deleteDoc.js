// const admin = require("../../config/firebase-admin");

// /**
//  * Delete a document from a specified Firestore collection.
//  * @param {string} collectionName - Name of the Firestore collection.
//  * @param {string} documentId - ID of the document to delete.
//  * @throws {Error} Throws an error if the Firestore operation fails, except when documentId is null.
//  */
// const deleteDocument = async (collectionName, documentId) => {
//   if (!documentId) {
//     return null;
//   }
//   const db = admin.firestore();
//   const collection = db.collection(collectionName);

//   try {
//     if (documentId === null) {
//       console.log("documentId is null, no document deleted.");
//       return; // Exit the function without performing any deletion.
//     }

//     const documentRef = collection.doc(documentId);
//     await documentRef.delete();
//     console.log(`Document with ID ${documentId} successfully deleted.`);
//   } catch (error) {
//     console.error(error);
//     throw new Error(`Failed to delete document with ID ${documentId}.`);
//   }
// };

// module.exports = deleteDocument;

const deleteDocument = async (db, batch, collectionName, documentId) => {
  if (!documentId) {
    return null;
  }

  const docRef = db.collection(collectionName).doc(documentId);

  try {
    if (!documentId || !collectionName || !db || !batch) {
      console.log("documentId is null, no document deleted.");
      return; // Exit the function without performing any deletion.
    }

    batch.delete(docRef);
    console.log(`Document with ID ${documentId} scheduled for deletion.`);
  } catch (error) {
    console.error(error);
    throw new Error(
      `Failed to schedule deletion of document with ID ${documentId}.`
    );
  }
};

module.exports = deleteDocument;
