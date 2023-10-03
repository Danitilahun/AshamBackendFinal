/**
 * Function to remove elements from two arrays and update the 'tablecount' field.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} collectionName - Name of the Firestore collection.
 * @param {string} documentId - ID of the Firestore document.
 * @param {string} fieldName1 - Name of the first array field.
 * @param {string} fieldName2 - Name of the second array field.
 * @param {string} element1ToRemove - The first element to remove from the first array.
 * @param {string} element2ToRemove - The second element to remove from the second array.
 * @param {number} countChange - The value to increment the 'tablecount' field by.
 */
const popElementsAndUpdateCount = async (
  db,
  batch,
  collectionName,
  documentId,
  fieldName1,
  fieldName2,
  element1ToRemove,
  element2ToRemove,
  countChange
) => {
  const docRef = db.collection(collectionName).doc(documentId);

  try {
    const snapshot = await docRef.get();
    if (snapshot.exists) {
      const data = snapshot.data();

      if (
        data[fieldName1] &&
        Array.isArray(data[fieldName1]) &&
        data[fieldName2]
      ) {
        const newArray1 = data[fieldName1].filter(
          (item) => item !== element1ToRemove
        );

        const newArray2 = data[fieldName2].filter(
          (item) => item !== element2ToRemove
        );

        const updateObject = {
          [fieldName1]: newArray1,
          [fieldName2]: newArray2,
          tablecount: (data.tablecount || 0) + countChange,
        };

        batch.update(docRef, updateObject);

        console.log(
          `Elements "${element1ToRemove}" and "${element2ToRemove}" removed from arrays, and 'tablecount' field updated.`
        );
      } else {
        console.log(`One or both fields are not arrays.`);
      }
    } else {
      console.log("Document does not exist.");
    }
  } catch (error) {
    console.error("Error removing elements and updating count:", error);
  }
};

module.exports = popElementsAndUpdateCount;
