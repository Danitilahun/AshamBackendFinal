const admin = require("../../config/firebase-admin");

// Arrow function to delete documents where branchId matches the specified value and source is "Credit"
const deleteDocumentsAndGetSum = async (collectionName, Id, db, batch) => {
  if (!Id || !collectionName) {
    return null;
  }

  try {
    const querySnapshot = await db
      .collection(collectionName)
      .where("deliveryguyId", "==", Id)
      .where("source", "==", "Credit")
      .get();

    let totalAmount = 0; // Initialize a variable to store the sum of amounts

    querySnapshot.forEach((doc) => {
      // Get the amount from each document and add it to the total
      const amount = doc.data().amount;
      totalAmount += amount;

      // Delete each document in the query result
      batch.delete(doc.ref);
    });

    console.log(
      `Documents in ${collectionName} with branchId "${Id}" and source "Credit" have been deleted.`
    );

    return totalAmount; // Return the sum of amounts
  } catch (error) {
    console.error("Error deleting documents:", error);
    return null; // Handle the error gracefully by returning null
  }
};

// Export the deleteDocumentsAndGetSum function
module.exports = deleteDocumentsAndGetSum;
