// const admin = require("../../config/firebase-admin");

// const pushToFieldArray = async (
//   collectionName,
//   docId,
//   field,
//   itemToPush,
//   maxItems = 4
// ) => {
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

//     // If the array has more than maxItems, remove the earliest items
//     if (existingArray.length > maxItems) {
//       existingArray.splice(0, existingArray.length - maxItems);
//     }

//     // Update the field with the updated array
//     await documentRef.update({ [field]: existingArray });

//     return documentSnapshot.data();
//   } catch (error) {
//     throw new Error(`Error getting/updating document: ${error.message}`);
//   }
// };

// module.exports = pushToFieldArray;

// const admin = require("../../config/firebase-admin");

const pushToFieldArray = async (
  collectionName,
  docId,
  field,
  itemToPush,
  db,
  batch,
  other
) => {
  try {
    console.log(docId, field, itemToPush, collectionName);
    if (!docId || !field || !itemToPush || !collectionName) {
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
    // Get the existing array from the 'date' field or an empty array if the field does not exist
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

    // If the array has more than maxItems, remove the earliest items
    if (existingArray.length > 4) {
      existingArray.splice(0, existingArray.length - maxItems);
    }

    // Update the field with the updated array using the batch
    batch.update(documentRef, { [field]: existingArray, ...other });

    return documentSnapshot.data();
  } catch (error) {
    throw new Error(`Error getting/updating document: ${error.message}`);
  }
};

module.exports = pushToFieldArray;
