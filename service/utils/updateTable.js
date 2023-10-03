// const admin = require("../../config/firebase-admin");

// /**
//  * Update a document in Firestore by incrementing or updating specific fields for two different IDs within the document.
//  *
//  * @param {string} collectionName - The name of the Firestore collection.
//  * @param {string} docId - The ID of the document to update.
//  * @param {string} idToUpdate - The first ID within the document to update.
//  * @param {Object} newData - The data to update within the specified ID.
//  * @param {string} idToUpdate2 - The second ID within the document to update.
//  * @throws {Error} Throws an error if the update operation fails.
//  */
// const updateTable = async (
//   collectionName,
//   docId,
//   idToUpdate,
//   idToUpdate2,
//   newData
// ) => {
//   const db = admin.firestore();

//   try {
//     if (!docId || !idToUpdate || !idToUpdate2) {
//       return null;
//     }

//     // Get the document from the collection
//     const docRef = db.collection(collectionName).doc(docId);
//     const snapshot = await docRef.get();

//     if (!snapshot.exists) {
//       console.log("Document not found.");
//       return;
//     }

//     // Update the data for the first ID
//     const updateData = {};
//     Object.keys(newData).forEach((key) => {
//       if (typeof newData[key] === "number") {
//         updateData[`${idToUpdate}.${key}`] =
//           admin.firestore.FieldValue.increment(newData[key]);
//       }
//     });

//     await docRef.update(updateData);

//     // Update the data for the second ID
//     const updateData2 = {};
//     Object.keys(newData).forEach((key) => {
//       if (typeof newData[key] === "number") {
//         updateData2[`${idToUpdate2}.${key}`] =
//           admin.firestore.FieldValue.increment(newData[key]);
//       }
//     });

//     await docRef.update(updateData2);

//     console.log("Data updated successfully.");
//     const updatedDocSnapshot = await docRef.get();
//     return updatedDocSnapshot.data();
//   } catch (error) {
//     console.error("Error updating data:", error);
//     throw error; // Re-throw the error to handle it at the caller's level
//   }
// };

// module.exports = updateTable;

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
    if (!docId || !idToUpdate || !idToUpdate2) {
      return null;
    }

    // Get the document references from the collection
    const docRef1 = db.collection(collectionName).doc(docId);
    const docRef2 = db.collection(collectionName).doc(docId); // Use the same docId

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

    console.log("Data updated successfully.");
    const updatedDocSnapshot = await docRef1.get();
    return updatedDocSnapshot.data();
  } catch (error) {
    console.error("Error updating data:", error);
    throw error; // Re-throw the error to handle it at the caller's level
  }
};

module.exports = updateTable;
