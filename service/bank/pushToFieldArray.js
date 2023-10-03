// const admin = require("../../config/firebase-admin");

// /**
//  * Pushes an item into an array field of a document and returns the updated data.
//  *
//  * @param {string} collectionName - The name of the Firestore collection where the document is located.
//  * @param {string} docId - The ID of the document.
//  * @param {string} field - The name of the field (array) to push the item into.
//  * @param {any} itemToPush - The item to push into the field.
//  * @param {admin.firestore.Transaction} transaction - The Firestore transaction object.
//  * @returns {Promise<void>} A Promise that resolves when the update is complete.
//  * @throws {Error} Throws an error if the operation fails.
//  */
// const pushToFieldArray = async (
//   collectionName,
//   docId,
//   field,
//   itemToPush,
//   transaction
// ) => {
//   if (!docId) {
//     throw new Error("Document ID is missing.");
//   }

//   const db = admin.firestore();
//   const documentRef = db.collection(collectionName).doc(docId);

//   try {
//     // Fetch the document data outside of the transaction
//     const documentSnapshot = await documentRef.get();

//     if (!documentSnapshot.exists) {
//       throw new Error(`Document with ID ${docId} not found.`);
//     }

//     const existingData = documentSnapshot.data();
//     const existingArray = existingData[field] || [];

//     if (!existingArray.includes(itemToPush)) {
//       existingArray.push(itemToPush);

//       // Update the field with the updated array within the transaction
//       transaction.update(documentRef, { [field]: existingArray });
//       console.log(`Item added to the '${field}' array successfully.`);
//     } else {
//       console.log(
//         `Item '${itemToPush}' already exists in the '${field}' array.`
//       );
//     }
//   } catch (error) {
//     console.error(error);
//     throw new Error(`Error updating document: ${error.message}`);
//   }
// };

// module.exports = pushToFieldArray;

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
    throw new Error(`Error getting/updating document: ${error.message}`);
  }
};

module.exports = pushToFieldArray;
