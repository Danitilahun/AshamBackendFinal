const admin = require("../../config/firebase-admin");

/**
 * Creates a new document in a specified Firestore collection.
 *
 * @param {string} collectionName - The name of the Firestore collection where the document will be created.
 * @param {Object} data - The data to be added to the newly created document.
 * @param {Firestore.Transaction} transaction - The Firestore transaction object.
 * @returns {Promise<string>} A Promise that resolves with the ID of the created document.
 * @throws {Error} Throws an error if the operation fails.
 */
const createDocument = async (collectionName, data, transaction) => {
  try {
    const db = admin.firestore();
    const collection = db.collection(collectionName);
    // Ensure that reads are executed before writes within the transaction
    const docRef = collection.doc(); // Create a new document reference

    data.createdAt = admin.firestore.FieldValue.serverTimestamp();
    if (!data.date) {
      data.date = new Date();
    }

    // Set the document data within the transaction
    transaction.set(docRef, data);

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
