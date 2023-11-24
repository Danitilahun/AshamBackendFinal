const pushToFieldArray = async (
  db,
  batch,
  collectionName,
  docId,
  field,
  itemToPush
) => {
  try {
    if (!docId) {
      throw new Error(
        "Unable to update bank transaction for the branch because branch information is missing.Please refresh your browser and try again."
      );
    }

    // Get the document reference
    const documentRef = db.collection(collectionName).doc(docId);

    // Get the current data of the document
    const documentSnapshot = await documentRef.get();

    if (!documentSnapshot.exists) {
      // No document found
      return null;
    }

    // Get the existing array from the 'field' or an empty array if the field does not exist
    const existingArray = documentSnapshot.get(field) || [];

    // Check if itemToPush exists in the array
    if (!existingArray.includes(itemToPush)) {
      // Push the new item into the array
      existingArray.push(itemToPush);

      // Update the field with the updated array within the batch
      batch.update(documentRef, { [field]: existingArray });

      console.log(`Item added to the '${field}' array successfully.`);
    } else {
      console.log(
        `Item '${itemToPush}' already exists in the '${field}' array.`
      );
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = pushToFieldArray;
