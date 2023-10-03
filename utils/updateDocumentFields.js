const admin = require("./firebase-admin");

// Controller function to update specific fields of a document
const updateDocumentFields = async (
  collectionName,
  documentId,
  fieldsToUpdate
) => {
  try {
    // Get a reference to Firestore
    const db = admin.firestore();

    // Get a reference to the document you want to update
    const docRef = db.collection(collectionName).doc(documentId);

    // Update the specific fields using the update method
    await docRef.update(fieldsToUpdate);

    console.log("Document fields updated successfully!");
    return true;
  } catch (error) {
    console.error("Error updating document fields:", error);
    return false;
  }
};

module.exports = updateDocumentFields;
