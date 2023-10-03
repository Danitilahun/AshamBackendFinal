/**
 * Push an item to an array field in a Firestore document and update other fields.
 *
 * @param {string} collectionName - Name of the Firestore collection.
 * @param {string} docId - ID of the document to update.
 * @param {string} field - Name of the array field to push to.
 * @param {object} itemToPush - The item to push into the array.
 * @param {object} db - The Firestore database instance.
 * @param {object} batch - The Firestore batch object.
 * @param {object} data - Additional data to update in the document.
 * @returns {Promise<object>} The updated document data.
 * @throws {Error} Throws an error if the operation fails.
 */
const pushToFieldArrayAndUpdateFields = async (
  collectionName,
  docId,
  field,
  itemToPush,
  db,
  batch,
  data
) => {
  try {
    console.log(docId, field, itemToPush, collectionName);
    if (!docId || !field || !itemToPush || !collectionName) {
      return null;
    }
    // Get the document reference
    const documentRef = db.collection(collectionName).doc(docId);

    // Get the current data of the document
    const documentSnapshot = await documentRef.get();
    if (!documentSnapshot.exists) {
      // No document found
      throw new Error("Document not found");
    }
    // Get the existing array from the 'field' or initialize as an empty array if the field doesn't exist
    const existingArray = documentSnapshot.get(field) || [];

    // Check if an object with the same 'id' exists in the array
    const existingObjectIndex = existingArray.findIndex(
      (item) => item.id === itemToPush.id
    );

    if (existingObjectIndex !== -1) {
      // Update the other fields of the existing object
      existingArray[existingObjectIndex] = {
        ...existingArray[existingObjectIndex],
        ...itemToPush,
      };
      console.log(
        `Item with id '${itemToPush.id}' updated in the '${field}' array.`
      );
    } else {
      // Add the new item into the array
      existingArray.push(itemToPush);
      console.log(`Item added to the '${field}' array successfully.`);
    }

    // If the array has more than 4 items, remove the earliest items
    if (existingArray.length > 4) {
      existingArray.splice(0, existingArray.length - 4);
    }

    // Update the 'field' with the updated array and other fields using the batch
    batch.update(documentRef, { [field]: existingArray, ...data });

    return documentSnapshot.data();
  } catch (error) {
    throw new Error(`Error getting/updating document: ${error.message}`);
  }
};

module.exports = pushToFieldArrayAndUpdateFields;
