// const admin = require("../../config/firebase-admin");

// /**
//  * Remove an element from an array field in a Firestore document.
//  *
//  * @param {string} fieldName - The name of the array field.
//  * @param {Object} elementToRemove - The element to remove from the array.
//  * @param {string} id - The ID of the document containing the array.
//  * @param {string} collectionName - The name of the Firestore collection.
//  * @returns {void}
//  */
// const popArrayElement = async (
//   fieldName,
//   elementToRemove,
//   id,
//   collectionName
// ) => {
//   const db = admin.firestore();
//   const docRef = db.collection(collectionName).doc(id);

//   try {
//     if (!id) {
//       return null;
//     }
//     const snapshot = await docRef.get();

//     if (snapshot.exists) {
//       const data = snapshot.data();

//       if (data[fieldName] && Array.isArray(data[fieldName])) {
//         const newArray = data[fieldName].filter(
//           (item) => item.id !== elementToRemove.id
//         );

//         await docRef.update({ [fieldName]: newArray });

//         console.log(
//           `Element with id "${elementToRemove.id}" removed from array.`
//         );
//       } else {
//         console.log(`Field "${fieldName}" is not an array.`);
//       }
//     } else {
//       console.log("Document does not exist.");
//     }
//   } catch (error) {
//     console.error("Error removing element:", error);
//   }
// };

// module.exports = popArrayElement;

// const admin = require("../../config/firebase-admin");

/**
 * Remove an element from an array field in a Firestore document.
 *
 * @param {string} fieldName - The name of the array field.
 * @param {Object} elementToRemove - The element to remove from the array.
 * @param {string} id - The ID of the document containing the array.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {object} db - The Firestore database instance.
 * @param {object} batch - The Firestore batch object.
 * @returns {void}
 */
const popArrayElement = async (
  fieldName,
  elementToRemove,
  id,
  collectionName,
  db,
  batch,
  dataUpdate = {}
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

      if (data[fieldName] && Array.isArray(data[fieldName])) {
        const newArray = data[fieldName].filter(
          (item) => item.id !== elementToRemove.id
        );

        batch.update(docRef, { [fieldName]: newArray, ...dataUpdate });

        console.log(
          `Element with id "${elementToRemove.id}" removed from array.`
        );
      } else {
        console.log(`Field "${fieldName}" is not an array.`);
      }
    } else {
      console.log("Document does not exist.");
    }
  } catch (error) {
    console.error("Error removing element:", error);
  }
};

module.exports = popArrayElement;
