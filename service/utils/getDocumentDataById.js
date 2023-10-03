const admin = require("../../config/firebase-admin");
/**
 * Helper function to retrieve document data from a Firestore collection by document ID.
 * @param {string} collectionName - Name of the Firestore collection.
 * @param {string} documentId - ID of the document to retrieve.
 * @returns {Object} Document data.
 * @throws {Error} Throws an error if the document is not found.
 */
const getDocumentDataById = async (collectionName, documentId) => {
  if (!documentId) {
    return null;
  }
  const db = admin.firestore();
  const collection = db.collection(collectionName);
  const documentRef = collection.doc(documentId);

  const documentSnapshot = await documentRef.get();
  if (!documentSnapshot.exists) {
    return null;
  }

  return documentSnapshot.data();
};

module.exports = getDocumentDataById;
