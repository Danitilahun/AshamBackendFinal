/**
 * Remove an element from an array field in a Firestore document and
 * update or create fields in the same document using a batch.
 *
 * @param {string} fieldName - The name of the array field to update.
 * @param {Object} elementToRemove - The element to remove from the array.
 * @param {string} id - The ID of the document containing the array.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {object} db - The Firestore database instance.
 * @param {object} batch - The Firestore batch object.
 * @param {object} newData - Data to update or create in the document.
 * @returns {void}
 */
const popArrayElementAndUpdateFields = async (
  fieldName,
  elementToRemove,
  id,
  collectionName,
  db,
  batch,
  newData
) => {
  const docRef = db.collection(collectionName).doc(id);

  try {
    if (
      !id ||
      !elementToRemove ||
      !fieldName ||
      !collectionName ||
      !db ||
      !batch
    ) {
      return null;
    }

    const snapshot = await docRef.get();
    if (snapshot.exists) {
      const data = snapshot.data();

      // Combine both operations into a single object, including existing data
      const combinedData = {
        [fieldName]: data[fieldName].filter(
          (item) => item.id !== elementToRemove.id
        ),
        ...newData,
        ...data,
      };

      console.log(combinedData);
      // Perform both operations without starting or committing the batch
      batch.set(docRef, combinedData, { merge: true });

      console.log(
        `Element with id "${elementToRemove.id}" removed from array.`
      );
    } else {
      console.log("Document does not exist.");
    }
  } catch (error) {
    console.error("Error removing element or updating fields:", error);
    throw error;
  }
};

module.exports = popArrayElementAndUpdateFields;
