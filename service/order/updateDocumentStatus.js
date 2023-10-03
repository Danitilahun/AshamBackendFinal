/**
 * Update the status of a document in a Firestore collection.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch instance.
 * @param {string} collectionName - Name of the Firestore collection.
 * @param {string} docId - ID of the document to update.
 * @param {string} newStatus - The new status to set for the document.
 * @returns {Promise<boolean>} - A promise that resolves to true if the status is updated successfully, or false if the document is not found.
 */
const updateDocumentStatus = async (
  db,
  batch,
  collectionName,
  docId,
  newStatus
) => {
  try {
    const docRef = db.collection(collectionName).doc(docId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return false; // Document not found
    } else {
      // Add the update operation to the batch
      batch.update(docRef, { status: newStatus });
      return true; // Status update added to the batch
    }
  } catch (error) {
    console.error("Error updating status:", error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
};

module.exports = updateDocumentStatus;
