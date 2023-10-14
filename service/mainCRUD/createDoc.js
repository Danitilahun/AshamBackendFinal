// // createDocument.js

const admin = require("../../config/firebase-admin");
// /**
//  * Creates a new document in a specified Firestore collection.
//  *
//  * @param {string} collectionName - The name of the Firestore collection where the document will be created.
//  * @param {Object} data - The data to be added to the newly created document.
//  * @returns {Promise<string>} A Promise that resolves with the ID of the created document.
//  * @throws {Error} Throws an error if the operation fails.
//  *
//  */
// const createDocument = async (collectionName, data) => {
//   const db = admin.firestore();
//   const collection = db.collection(collectionName);

//   try {
//     data.createdAt = admin.firestore.FieldValue.serverTimestamp();
//     if (!data.date) {
//       data.date = new Date();
//     }
//     const docRef = await collection.add(data);
//     console.log(
//       `Document successfully created in collection: ${collectionName}`
//     );
//     return docRef.id; // Return the ID of the created document
//   } catch (error) {
//     console.error(error);
//     throw new Error(
//       `Failed to create document in collection: ${collectionName}`
//     );
//   }
// };

// module.exports = createDocument;

const createDocument = async (collectionName, data, db, batch) => {
  const collection = db.collection(collectionName);

  try {
    data.createdAt = admin.firestore.FieldValue.serverTimestamp();
    if (!data.date) {
      data.date = new Date();
    }
    const docRef = collection.doc(); // Generate a new document reference
    batch.set(docRef, data); // Add the data to the batch
    console.log(
      `Document successfully created in collection: ${collectionName}`
    );
    return docRef.id; // Return the ID of the created document
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = createDocument;
