const admin = require("../config/firebase-admin");

// Function to increment the 'count' field in a document by one
const incrementCount = async (collectionName, documentId) => {
  try {
    // Get a reference to Firestore
    const firestore = admin.firestore();

    // Create a reference to the document
    const documentRef = firestore.collection(collectionName).doc(documentId);

    // Get the current 'count' value from the document
    const documentSnapshot = await documentRef.get();
    const currentCount = documentSnapshot.get("tablecount") || 0;

    // Increment the count by one
    const newCount = currentCount + 1;

    // Update the 'count' field in the document with the new value
    await documentRef.update({ tablecount: newCount });

    console.log(
      `'count' field in document '${documentId}' updated successfully.`
    );
  } catch (error) {
    throw new Error(`Error updating 'count' field: ${error.message}`);
  }
};

module.exports = incrementCount;
