// const admin = require("../../config/firebase-admin");

// /**
//  * Delete a specific field from a document in a Firestore collection.
//  *
//  * @param {string} collectionName - The name of the Firestore collection containing the document.
//  * @param {string} id - The ID of the document to update.
//  * @param {string} fieldName - The name of the field to be deleted.
//  * @throws {Error} Throws an error if the operation fails.
//  */
// const deleteField = async (collectionName, id, fieldName) => {
//   const db = admin.firestore();
//   const docRef = db.collection(collectionName).doc(id);

//   if (!id) {
//     return null;
//   }

//   try {
//     const snapshot = await docRef.get();

//     if (snapshot.exists) {
//       const data = snapshot.data();
//       if (data[fieldName] !== undefined) {
//         delete data[fieldName];
//         console.log(data);
//         await docRef.set(data);
//         console.log(`Field "${fieldName}" deleted successfully.`);
//       } else {
//         console.log(`Field "${fieldName}" does not exist.`);
//       }
//     } else {
//       console.log("Document does not exist.");
//     }
//   } catch (error) {
//     console.error("Error deleting field:", error);
//     throw new Error(`Failed to delete field "${fieldName}".`);
//   }
// };

// module.exports = deleteField;

const deleteField = async (db, batch, collectionName, id, fieldName) => {
  const docRef = db.collection(collectionName).doc(id);

  if (!id) {
    throw new Error(
      "Unable to delete from Deliveryturn queue because branch information is missing.Please refresh your browser and try again."
    );
  }

  try {
    const snapshot = await docRef.get();

    if (snapshot.exists) {
      const data = snapshot.data();
      if (data[fieldName] !== undefined) {
        delete data[fieldName];
        batch.set(docRef, data);
        console.log(`Field "${fieldName}" deleted successfully.`);
      } else {
        console.log(`Field "${fieldName}" does not exist.`);
      }
    } else {
      console.log("Document does not exist.");
    }
  } catch (error) {
    console.error("Error deleting field:", error);
    throw new Error(`Failed to delete field "${fieldName}".`);
  }
};

module.exports = deleteField;
