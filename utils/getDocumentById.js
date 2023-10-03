const admin = require("../config/firebase-admin");

// Function to get a document from Firestore by ID
const getDocumentById = async (collectionName, documentId) => {
  try {
    // Get a reference to Firestore
    const firestore = admin.firestore();

    // Create a reference to the document
    const documentRef = firestore.collection(collectionName).doc(documentId);

    // Get the document snapshot
    const docSnapshot = await documentRef.get();

    // Check if the document exists
    if (docSnapshot.exists) {
      // Document data is available in docSnapshot.data() as an object
      const documentData = docSnapshot.data();
      return documentData;
    } else {
      // Document not found
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    throw new Error(`Error getting document: ${error.message}`);
  }
};

module.exports = getDocumentById;
