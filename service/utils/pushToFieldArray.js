// const admin = require("../../config/firebase-admin");

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
//     const existingArray = documentSnapshot.get(field) || [];

//     // Check if an object with the same 'id' exists in the array
//     const existingObjectIndex = existingArray.findIndex(
//       (item) => item.id === itemToPush.id
//     );

//     if (existingObjectIndex !== -1) {
//       // Update the other fields of the existing object
//       existingArray[existingObjectIndex] = {
//         ...existingArray[existingObjectIndex],
//         ...itemToPush,
//       };
//       console.log(
//         `Item with id '${itemToPush.id}' updated in the '${field}' array.`
//       );
//     } else {
//       // Add the new item into the array
//       existingArray.push(itemToPush);
//       console.log(`Item added to the '${field}' array successfully.`);
//     }

//     // Update the field with the updated array
//     await documentRef.update({ [field]: existingArray });

//     return documentSnapshot.data();
//   } catch (error) {
//     throw new Error(`Error getting/updating document: ${error.message}`);
//   }
// };

// module.exports = pushToFieldArray;

const admin = require("../../config/firebase-admin");

/**
 * Add an item to a field array in a Firestore document.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} collectionName - Name of the Firestore collection.
 * @param {string} docId - ID of the Firestore document.
 * @param {string} field - Name of the field (array) to which the item will be added.
 * @param {Object} itemToPush - The item to push into the field array.
 * @returns {Promise<Object>} A Promise that resolves with the updated document data.
 * @throws {Error} Throws an error if the operation fails.
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

    // Use the batch to update the field with the updated array
    batch.update(documentRef, { [field]: existingArray });

    return documentSnapshot.data();
  } catch (error) {
    throw new Error(`Error getting/updating document: ${error.message}`);
  }
};

module.exports = pushToFieldArray;
