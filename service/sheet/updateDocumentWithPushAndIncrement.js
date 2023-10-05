/**
 * Push an item to a field array in a Firestore document and increment a numeric field within a batch.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} collectionName - Name of the Firestore collection.
 * @param {string} docId - ID of the Firestore document.
 * @param {string} fieldArray - Name of the field (array) to push the item to.
 * @param {string} numericField - Name of the numeric field to increment.
 * @param {string} itemToPush - The item to push to the field array.
 * @param {number} amount - The value to increment the numeric field by.
 * @returns {Promise<void>} A Promise that resolves when the batch operation is complete.
 */
const updateDocumentWithPushAndIncrement = async (
  db,
  batch,
  collectionName,
  docId,
  fieldArray,
  numericField,
  itemToPush,
  amount
) => {
  try {
    if (!docId) {
      throw new Error(
        "Some required parameters for sheet Summary are missing. Please refresh your browser and try again."
      );
    }
    // Get the document reference
    const documentRef = db.collection(collectionName).doc(docId);

    // Get the current data of the document
    const documentSnapshot = await documentRef.get();
    if (!documentSnapshot.exists) {
      // No document found
      throw new Error("Document not found");
    }

    // Get the existing array from the field or an empty array if the field does not exist
    const existingArray = documentSnapshot.get(fieldArray) || [];

    // Check if itemToPush exists in the array
    if (!existingArray.includes(itemToPush)) {
      // Push the new item into the array
      existingArray.push(itemToPush);
    } else {
      console.log(
        `Item '${itemToPush}' already exists in the '${fieldArray}' array.`
      );
    }

    // Step 2: Get the current value of the numeric field
    const currentValue = documentSnapshot.get(numericField) || 0;
    const newValue = currentValue + amount;

    // Update the field array and numeric field with the updated values within the batch
    batch.update(documentRef, {
      [fieldArray]: existingArray,
      [numericField]: newValue,
    });

    console.log(`Item added to the '${fieldArray}' array successfully.`);
    console.log(`Numeric field '${numericField}' incremented by ${amount}.`);
  } catch (error) {
    throw new Error(`Error getting/updating document: ${error.message}`);
  }
};

module.exports = updateDocumentWithPushAndIncrement;
