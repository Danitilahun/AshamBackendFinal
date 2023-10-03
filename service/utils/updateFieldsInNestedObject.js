/**
 * Update fields within a nested object in a Firestore document.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} collectionName - Name of the Firestore collection.
 * @param {string} documentId - ID of the Firestore document.
 * @param {string} objectId - ID of the nested object within the document.
 * @param {Object} fieldsToUpdate - An object containing the fields to update within the nested object.
 * @returns {Promise<Object>} A Promise that resolves with the updated document data.
 * @throws {Error} Throws an error if there's an issue with the operation.
 */
const updateFieldsInNestedObject = async (
  db,
  batch,
  collectionName,
  documentId,
  objectId,
  fieldsToUpdate
) => {
  try {
    // Get the document reference
    const documentRef = db.collection(collectionName).doc(documentId);

    // Get the current data of the document
    const documentSnapshot = await documentRef.get();

    if (!documentSnapshot.exists) {
      // No document found
      throw new Error("Document not found");
    }

    // Extract the object containing the fields you want to update
    const documentData = documentSnapshot.data();
    const targetObject = documentData[objectId];

    if (!targetObject) {
      throw new Error(`Object with ID ${objectId} not found`);
    }

    // Update the fields within the object
    for (const field in fieldsToUpdate) {
      if (fieldsToUpdate.hasOwnProperty(field)) {
        targetObject[field] = fieldsToUpdate[field];
      }
    }

    // Use the batch to update the document with the modified object
    batch.update(documentRef, { [objectId]: targetObject });

    console.log("Fields updated successfully.");
    // Return the updated document data
    return { ...documentData, [objectId]: targetObject };
  } catch (error) {
    throw new Error(`Error getting/updating document: ${error.message}`);
  }
};

module.exports = updateFieldsInNestedObject;
