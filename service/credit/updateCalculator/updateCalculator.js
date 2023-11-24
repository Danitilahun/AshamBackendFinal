// const admin = require("../../../config/firebase-admin");

const updateCalculator = async (id, valueToAdd, db, batch) => {
  try {
    if (!id) {
      throw new Error(
        "Unable to update calculator information is not provided.Please refresh your browser and try again."
      );
    }
    const docRef = db.collection("Calculator").doc(id);

    // Get the current data of the document
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      throw new Error("Document not found");
    }

    const data = docSnapshot.data();
    const newActual = data.actual + data.totalCredit - valueToAdd;
    const newBalance = data.sum - newActual;

    // Update the Firestore document with the updated data in the batch
    batch.update(docRef, {
      actual: newActual,
      balance: newBalance,
      totalCredit: valueToAdd,
    });

    console.log("Calculator updated successfully");
  } catch (error) {
    console.log("Error updating Calculator in credit:", error);
    throw error; // Re-throw the error to handle it at the caller's level
  }
};

module.exports = updateCalculator;
