const admin = require("../../../config/firebase-admin");

/**
 * Update a document in Firestore by incrementing or updating specific fields for two different IDs within the document.
 *
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {string} docId - The ID of the document to update.
 * @param {string} idToUpdate - The first ID within the document to update.
 * @param {Object} newData - The data to update within the specified ID.
 * @param {string} idToUpdate2 - The second ID within the document to update.
 * @param {admin.firestore.Firestore} db - Firestore database instance.
 * @param {admin.firestore.WriteBatch} batch - Firestore batch instance.
 * @throws {Error} Throws an error if the update operation fails.
 */
const updateSalaryTable = async (
  collectionName,
  docId,
  idToUpdate,
  idToUpdate2,
  newData,
  db,
  batch
) => {
  try {
    if (!docId) {
      throw new Error(
        "Unable to update salary for delivery guy.Please refresh your browser and try again."
      );
    }

    // Get the document reference from the collection
    const docRef = db.collection(collectionName).doc(docId);

    // Initialize batch to perform atomic updates
    if (!batch) {
      batch = db.batch();
    }

    // Update the data for the first ID
    const updateData = {};
    Object.keys(newData).forEach((key) => {
      if (typeof newData[key] === "number") {
        updateData[`${idToUpdate}.${key}`] =
          admin.firestore.FieldValue.increment(newData[key]);
      }
    });

    batch.update(docRef, updateData);

    // Update the data for the second ID
    const updateData2 = {};
    Object.keys(newData).forEach((key) => {
      if (typeof newData[key] === "number") {
        updateData2[`${idToUpdate2}.${key}`] =
          admin.firestore.FieldValue.increment(newData[key]);
      }
    });

    batch.update(docRef, updateData2);

    const updatedDocSnapshot = await docRef.get();
    return updatedDocSnapshot.data(); // Return the batch instance for further processing
  } catch (error) {
    console.error("Error updating data:", error);
    throw error; // Re-throw the error to handle it at the caller's level
  }
};

module.exports = updateSalaryTable;
