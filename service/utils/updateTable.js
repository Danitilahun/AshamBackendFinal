const admin = require("../../config/firebase-admin");

/**
 * Update a document in Firestore by incrementing or updating specific fields for two different IDs within the document.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {string} docId - The ID of the document to update.
 * @param {string} idToUpdate - The first ID within the document to update.
 * @param {Object} newData - The data to update within the specified ID.
 * @param {string} idToUpdate2 - The second ID within the document to update.
 * @param {Object} batch - The Firestore batch to which the updates should be added.
 * @throws {Error} Throws an error if the update operation fails.
 */

const updateTable = async (
  db,
  collectionName,
  docId,
  idToUpdate,
  idToUpdate2,
  newData,
  batch
) => {
  try {
    // console.log("Updating data...", docId, idToUpdate, idToUpdate2, newData);
    if (!docId || !idToUpdate || !idToUpdate2) {
      throw new Error(
        "Missing required parameters for update table.Please check you have table Sheet and table for a day."
      );
    }

    // Get the document references from the collection
    const docRef1 = db.collection(collectionName).doc(docId);
    const docRef2 = db.collection(collectionName).doc(docId); // Use the same docId

    const docSnapshot = await docRef1.get();
    const currentData = docSnapshot.data();

    // console.log("currentData", currentData);
    // Check if the specified IDs exist in the document
    if (!currentData || !currentData[idToUpdate] || !currentData[idToUpdate2]) {
      throw new Error(
        "Daily table do not exist.Please check you have Sheet and table for a day.If not create one first.This error may be caused by internet connection also.Please check your internet connection , refresh your browser and try again."
      );
    }

    // Update the data for the first ID
    const updateData1 = {};
    Object.keys(newData).forEach((key) => {
      if (typeof newData[key] === "number") {
        updateData1[`${idToUpdate}.${key}`] =
          admin.firestore.FieldValue.increment(newData[key]);
      }
    });

    // Add the update operation for the first ID to the batch
    batch.update(docRef1, updateData1);

    // Update the data for the second ID
    const updateData2 = {};
    Object.keys(newData).forEach((key) => {
      if (typeof newData[key] === "number") {
        updateData2[`${idToUpdate2}.${key}`] =
          admin.firestore.FieldValue.increment(newData[key]);
      }
    });

    // Add the update operation for the second ID to the batch
    batch.update(docRef2, updateData2);

    const updatedDocSnapshot = await docRef1.get();
    return updatedDocSnapshot.data();
  } catch (error) {
    throw error; // Re-throw the error to handle it at the caller's level
  }
};

module.exports = updateTable;
