const admin = require("../config/firebase-admin");
// Arrow function to update a specific field of a document by ID
const updateFieldInDocument = async (
  collectionName,
  documentId,
  fieldName,
  newValue
) => {
  const db = admin.firestore();
  const documentRef = db.collection(collectionName).doc(documentId);

  try {
    const documentSnapshot = await documentRef.get();

    if (documentSnapshot.exists) {
      // Update the specific field
      await documentRef.update({
        [fieldName]: newValue,
      });

      console.log(`Document ${documentId} updated successfully.`);
    } else {
      console.log(`Document ${documentId} not found.`);
    }
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

module.exports = updateFieldInDocument;
