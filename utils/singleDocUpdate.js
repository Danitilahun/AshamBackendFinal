const admin = require("../config/firebase-admin");

// Controller function to update specific fields of the document
const updateDocumentFields = async (collectionName, fieldsToUpdate) => {
  try {
    // Get a reference to Firestore
    const db = admin.firestore();

    // Get a reference to the collection
    const collectionRef = db.collection(collectionName);

    // Get all documents in the collection (assuming there's only one document)
    const querySnapshot = await collectionRef.get();

    // Get the first document in the querySnapshot (assuming there's only one document)
    const documentSnapshot = querySnapshot.docs[0];

    // Update the specific fields using the update method
    await documentSnapshot.ref.update(fieldsToUpdate);

    console.log("Document fields updated successfully!");
    return true;
  } catch (error) {
    console.error("Error updating document fields:", error);
    return false;
  }
};

module.exports = updateDocumentFields;
