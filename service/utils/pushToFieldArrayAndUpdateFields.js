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
    if (!docId) {
      throw new Error(
        "Branch information is missing.Please refresh your browser and try again."
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
      const removedItem = existingArray.shift(); // Remove the first item and store it in 'removedItem'
      console.log(`Removed item: ${JSON.stringify(removedItem)}`);

      // Delete documents with the same document ID from "salary" and "staffSalary" collections
      const salaryRef = db.collection("salary").doc(removedItem.id);
      const staffSalaryRef = db.collection("staffSalary").doc(removedItem.id);
      const statusRef = db.collection("Status").doc(removedItem.id);

      batch.delete(salaryRef);
      batch.delete(staffSalaryRef);
      batch.delete(statusRef);
    }

    // Update the 'field' with the updated array and other fields using the batch
    batch.update(documentRef, { [field]: existingArray, ...data });

    return documentSnapshot.data();
  } catch (error) {
    throw error;
  }
};

module.exports = pushToFieldArrayAndUpdateFields;
