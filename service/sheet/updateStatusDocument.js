// const admin = require("../../config/firebase-admin");

// /**
//  * Sets a Firestore "Status" document with the provided data.
//  * @param {string} id - The ID of the document to set.
//  * @param {Object} updatedStatusData - The updated status data.
//  * @returns {Promise<Object>} A Promise that resolves with the updated status data when the document is set successfully.
//  */
// const setStatusDocument = async (id, updatedStatusData) => {
//   if (!id) {
//     return null;
//   }
//   const db = admin.firestore();
//   const statusCollectionRef = db.collection("Status");
//   const statusDocumentRef = statusCollectionRef.doc(id);

//   try {
//     await statusDocumentRef.set(updatedStatusData);
//     console.log("Status document set successfully.");

//     // Fetch the set document from Firestore (optional, you can remove this if not needed)
//     const setStatusSnapshot = await statusDocumentRef.get();
//     const setStatus = setStatusSnapshot.data();
//     return setStatus || updatedStatusData; // Return the updatedStatusData if you don't need the set data
//   } catch (error) {
//     console.error("Error setting Status document:", error);
//     throw error;
//   }
// };

// module.exports = setStatusDocument;

// const admin = require("../../config/firebase-admin");

/**
 * Sets a Firestore "Status" document with the provided data.
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} id - The ID of the document to set.
 * @param {Object} updatedStatusData - The updated status data.
 * @returns {Promise<Object>} A Promise that resolves with the updated status data when the document is set successfully.
 */
const setStatusDocument = async (db, batch, id, updatedStatusData) => {
  if (!id) {
    throw new Error(
      "Branch sheet infromation is missing.Please refresh your browser and try again."
    );
  }

  console.log(updatedStatusData);
  const statusCollectionRef = db.collection("Status");
  const statusDocumentRef = statusCollectionRef.doc(id);

  try {
    // Add the set operation to the batch (write operation)
    batch.set(statusDocumentRef, updatedStatusData);
    // You can optionally return the updatedStatusData here if needed
    return updatedStatusData;
  } catch (error) {
    console.error("Error setting Status document:", error);
    throw error;
  }
};

module.exports = setStatusDocument;
