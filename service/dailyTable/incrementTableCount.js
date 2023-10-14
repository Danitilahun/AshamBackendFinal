/**
 * Function to increment the 'count' field in a document by one.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} collectionName - Name of the Firestore collection.
 * @param {string} documentId - ID of the Firestore document.
 * @param {number} value - The value to increment by.
 */
const ChangeSheetTableCount = async (
  db,
  batch,
  collectionName,
  documentId,
  value
) => {
  try {
    if (!documentId) {
      throw new Error("Sheet not found. Please check  and try again.");
    }
    // Get a reference to Firestore
    const firestore = db;

    // Create a reference to the document
    const documentRef = firestore.collection(collectionName).doc(documentId);

    // Get the current 'count' value from the document
    const documentSnapshot = await documentRef.get();
    const currentCount = documentSnapshot.get("tablecount") || 0;

    // Increment the count by one
    const newCount = currentCount + value;

    // Add the update operation to the batch
    batch.update(documentRef, { tablecount: newCount });

    console.log(
      `'count' field in document '${documentId}' updated successfully.`
    );
  } catch (error) {
    throw error;
  }
};

module.exports = ChangeSheetTableCount;
