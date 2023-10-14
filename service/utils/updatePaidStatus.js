const admin = require("../../config/firebase-admin");

// Arrow function to update 'paid' status based on a specific field value
const updatePaidStatus = async (collectionName, fieldValue) => {
  if (!fieldValue || !collectionName) {
    return null;
  }

  try {
    const db = admin.firestore();
    const querySnapshot = await db
      .collection(collectionName)
      .where("branchId", "==", fieldValue)
      .get();

    // Use a batch to update documents in batches (optional)
    const batch = db.batch();

    querySnapshot.forEach((doc) => {
      // Update the 'paid' field based on the setPaid boolean value
      batch.update(doc.ref, { paid: false });
    });

    // Commit the batch to update the documents
    await batch.commit();

    console.log(
      `'paid' status updated for documents in ${collectionName} where ${fieldName} = ${fieldValue}.`
    );
  } catch (error) {
    console.error("Error updating documents:", error);
    throw error; // Re-throw the error to handle it at the caller's level
  }
};

// Export the updatePaidStatus function
module.exports = updatePaidStatus;
