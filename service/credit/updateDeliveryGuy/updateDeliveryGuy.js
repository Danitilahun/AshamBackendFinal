const admin = require("../../../config/firebase-admin");

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
