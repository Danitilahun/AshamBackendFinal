/**
 * Add a delivery guy to a Firestore collection with batch update support.
 *
 * @param {string} collectionName - Name of the Firestore collection.
 * @param {string} documentId - ID of the Firestore document.
 * @param {Object} newData - Data to be added or updated.
 * @param {Firestore} db - Firestore database instance.
 * @param {WriteBatch} batch - Firestore batch instance.
 * @returns {Promise<Object>} A Promise that resolves with the updated document data.
 * @throws {Error} Throws an error if there's an issue with the operation.
 */
const addDeliveryGuyToTable = async (
  collectionName,
  documentId,
  newData,
  db,
  batch
) => {
  try {
    if (!documentId) {
      throw new Error(
        "Unable to add delivery guy to table.Please refresh your browser and try again."
      );
    }
    // Get a reference to the document
    const documentRef = db.collection(collectionName).doc(documentId);

    // Get the current data of the document
    const documentSnapshot = await documentRef.get();
    console.log(documentSnapshot.data());
    if (!documentSnapshot.exists) {
      // No document found
      throw new Error("Document not found");
    }

    // Merge the new data with the existing document data
    const old = documentSnapshot.data();

    // Merge the new data with the existing data
    const updatedData = { ...old, ...newData };

    // Update the document with the merged data using the batch
    batch.update(documentRef, updatedData);

    console.log("Delivery guy added successfully.");

    // Return the updated document data
    return updatedData;
  } catch (error) {
    throw error;
  }
};

module.exports = addDeliveryGuyToTable;
