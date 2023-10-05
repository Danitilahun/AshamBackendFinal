/**
 * Increment a numeric field in a Firestore document by a specified value with batch update support.
 *
 * @param {string} collectionName - Name of the Firestore collection containing the document.
 * @param {string} documentId - ID of the Firestore document to update.
 * @param {string} fieldToIncrement - Name of the field to increment.
 * @param {number} value - The value to increment the field by.
 * @param {Firestore} db - Firestore database instance.
 * @param {WriteBatch} batch - Firestore batch instance.
 * @returns {Promise<number|null>} A Promise that resolves with the new value of the field after incrementing, or null if the document doesn't exist.
 * @throws {Error} Throws an error if there's an issue with the operation.
 */
const incrementFieldByOne = async (
  collectionName,
  documentId,
  fieldToIncrement,
  value,
  db,
  batch
) => {
  try {
    if (!documentId) {
      return null;
    }
    // Step 1: Get a reference to the document
    const docRef = db.collection(collectionName).doc(documentId);

    // Step 2: Get the current value of the field
    const docSnapshot = await docRef.get();

    // Step 3: If the document exists, calculate the new value
    if (docSnapshot.exists) {
      const currentValue = docSnapshot.get(fieldToIncrement) || 0;
      const newValue = currentValue + (value || 1);

      // Step 4: Update the document with the new value using the batch
      batch.update(docRef, {
        [fieldToIncrement]: newValue,
      });

      // Step 5: Return the new value after incrementing
      return newValue;
    }

    // Step 6: Document doesn't exist, return null
    return null;
  } catch (error) {
    // Step 7: Handle any errors that occur during the operation
    throw error;
  }
};

module.exports = incrementFieldByOne;
