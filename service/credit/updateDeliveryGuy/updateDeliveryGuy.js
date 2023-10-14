const admin = require("../../../config/firebase-admin");

// /**
//  * Update a document in Firestore by incrementing a specified field and return the updated data.
//  *
//  * @param {string} docId - The document ID to update.
//  * @param {string} field - The field to increment in the document.
//  * @param {number} value - The value to increment the specified field by.
//  * @returns {Promise<Object|null>} A Promise that resolves to the updated data object if successful, or null if the document doesn't exist.
//  * @throws {Error} Throws an error if the update operation fails.
//  */
// const updateDeliveryGuy = async (docId, field, value) => {
//   const db = admin.firestore();
//   const docRef = db.collection("deliveryguy").doc(docId);

//   try {
//     // Check if the document exists
//     const docSnapshot = await docRef.get();

//     if (docSnapshot.exists) {
//       // Document exists, increment the specified field
//       await docRef.update({
//         [field]: admin.firestore.FieldValue.increment(value),
//       });

//       // Retrieve the updated document
//       const updatedDocSnapshot = await docRef.get();

//       // Return the updated data
//       return updatedDocSnapshot.data();
//     } else {
//       return null;
//     }
//   } catch (error) {
//     // Handle the error and return an error message
//     console.error(`Error updating document with ID ${docId}:`, error);
//     return {
//       error: `An error occurred while updating the document with ID ${docId}.`,
//     };
//   }
// };

// module.exports = updateDeliveryGuy;

const updateDeliveryGuy = async (db, batch, docId, field, value) => {
  const docRef = db.collection("deliveryguy").doc(docId);

  try {
    if (!docId) {
      throw new Error("Delivery guy with this information do not exist.");
    }
    // Retrieve the delivery guy's document within the batch
    const docSnapshotBeforeUpdate = await docRef.get();

    if (docSnapshotBeforeUpdate.exists) {
      // Document exists, increment the specified field within the batch
      batch.update(docRef, {
        [field]: admin.firestore.FieldValue.increment(value ? value : 0),
      });

      // Fetch the updated data without committing the batch
      const updatedData = {
        ...docSnapshotBeforeUpdate.data(),
        [field]: docSnapshotBeforeUpdate.get(field) + (value ? value : 0),
      };
      return updatedData;
    }

    return null; // Return null if the document doesn't exist
  } catch (error) {
    // Handle the error and throw an error
    console.error(`Error updating document with ID ${docId}:`, error);
    throw error;
  }
};

module.exports = updateDeliveryGuy;
