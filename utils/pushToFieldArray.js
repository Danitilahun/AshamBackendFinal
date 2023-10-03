// const admin = require("../config/firebase-admin");

// const pushToFieldArray = async (collectionName, docId, field, itemToPush) => {
//   try {
//     // Get a reference to Firestore
//     const firestore = admin.firestore();

//     // Get the document reference
//     const documentRef = firestore.collection(collectionName).doc(docId);

//     // Get the current data of the document
//     const documentSnapshot = await documentRef.get();
//     if (!documentSnapshot.exists) {
//       // No document found
//       throw new Error("Document not found");
//     }
//     // Get the existing array from the 'date' field or an empty array if the field does not exist
//     const existingDateArray = documentSnapshot.get(field) || [];

//     // Check if itemToPush exists in the array
//     if (!existingDateArray.includes(itemToPush)) {
//       // Push the new item into the array
//       existingDateArray.push(itemToPush);

//       // Update the field with the updated array
//       await documentRef.update({ [field]: existingDateArray });
//       console.log(`Item added to the '${field}' array successfully.`);
//     } else {
//       console.log(
//         `Item '${itemToPush}' already exists in the '${field}' array.`
//       );
//     }
//     return documentSnapshot.data();
//   } catch (error) {
//     throw new Error(`Error getting/updating document: ${error.message}`);
//   }
// };

// module.exports = pushToFieldArray;

// const admin = require("../config/firebase-admin");

/**
 * Push an item to a field array in a Firestore document within a batch.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} collectionName - Name of the Firestore collection.
 * @param {string} docId - ID of the Firestore document.
 * @param {string} field - Name of the field (array) to push the item to.
 * @param {string} itemToPush - The item to push to the field array.
 * @returns {Promise<void>} A Promise that resolves when the batch operation is complete.
 */
const pushToFieldArray = async (
  db,
  batch,
  collectionName,
  docId,
  field,
  itemToPush
) => {
  try {
    // Get the document reference
    const documentRef = db.collection(collectionName).doc(docId);

    // Get the current data of the document
    const documentSnapshot = await documentRef.get();
    if (!documentSnapshot.exists) {
      // No document found
      throw new Error("Document not found");
    }

    // Get the existing array from the field or an empty array if the field does not exist
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
    throw new Error(`Error getting/updating document: ${error.message}`);
  }
};

module.exports = pushToFieldArray;
