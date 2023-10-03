const admin = require("../config/firebase-admin");
/**
 * Updates or creates fields in a Firestore document.
 *
 * @param {string} collectionName - Name of the Firestore collection.
 * @param {string} documentId - ID of the document to update or create.
 * @param {object} newData - Data to update or create in the document.
 * @returns {Promise<object>} The updated document data.
 * @throws {Error} Throws an error if the operation fails.
 */
const updateOrCreateFieldsInDocument = async (
  collectionName,
  documentId,
  newData
) => {
  try {
    // Get a reference to Firestore
    const firestore = admin.firestore();

    // Get the document reference
    const documentRef = firestore.collection(collectionName).doc(documentId);

    // Get the current data of the document
    const documentSnapshot = await documentRef.get();

    if (!documentSnapshot.exists) {
      // No document found, it will be created
      console.log("Document not found; creating a new one.");
    }

    // Merge the new data with the existing document data
    await documentRef.set(
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
