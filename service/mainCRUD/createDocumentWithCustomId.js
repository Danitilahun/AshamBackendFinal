// const admin = require("../../config/firebase-admin");

// /**
//  * Create a document in a specified Firestore collection with a custom ID.
//  *
//  * @param {string} collectionName - Name of the Firestore collection.
//  * @param {string} customId - Custom ID for the document.
//  * @param {Object} data - Data to be added to the document.
//  * @returns {Promise<void>} A Promise that resolves when the document is successfully created.
//  * @throws {Error} Throws an error if the operation fails.
//  */

// const createDocumentWithCustomId = async (collectionName, customId, data) => {
//   const db = admin.firestore();
//   const collection = db.collection(collectionName);

//   try {
//     data.createdAt = admin.firestore.FieldValue.serverTimestamp();
//     const docRef = collection.doc(customId);
//     await docRef.set(data);
//     console.log(
//       `Document successfully created in collection: ${collectionName} with custom ID: ${customId}`
//     );
//   } catch (error) {
//     console.error(error);
//     throw new Error(
//       `Failed to create document in collection: ${collectionName} with custom ID: ${customId}`
//     );
//   }
// };

// module.exports = createDocumentWithCustomId;

const admin = require("../../config/firebase-admin");

/**
 * Create a document in a specified Firestore collection with a custom ID.
 *
 * @param {string} collectionName - Name of the Firestore collection.
 * @param {string} customId - Custom ID for the document.
 * @param {Object} data - Data to be added to the document.
 * @param {admin.firestore.WriteBatch} batch - Firestore batch object.
 * @param {admin.firestore.Firestore} db - Firestore database instance.
 * @returns {Promise<void>} A Promise that resolves when the document is successfully created.
 * @throws {Error} Throws an error if the operation fails.
 */

const createDocumentWithCustomId = async (
  collectionName,
  customId,
  data,
  db,
  batch
) => {
  const collection = db.collection(collectionName);

  try {
    data.createdAt = admin.firestore.FieldValue.serverTimestamp();
    const docRef = collection.doc(customId);

    // Add the set operation to the batch.
    batch.set(docRef, data);

    console.log(
      `Document successfully created in collection: ${collectionName} with custom ID: ${customId}`
    );
  } catch (error) {
    console.error(error);
    throw new Error(
      `Failed to create document in collection: ${collectionName} with custom ID: ${customId}`
    );
  }
};

module.exports = createDocumentWithCustomId;
