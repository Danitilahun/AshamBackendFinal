const admin = require("../../config/firebase-admin");

/**
 * Update the "actual" field of the calculator document within a batch.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} id - The document ID.
 * @param {number} newActual - The new actual value to add to the existing one.
 * @returns {Promise<void>} A Promise that resolves when the batch operation is complete.
 */
const updateCalculatorActual = async (db, batch, id, newActual) => {
  try {
    if (!id) {
      throw new Error(
        "Unable to get calculator information to update. Please refresh your browser and try again."
      );
    }

    const docRef = db.collection("Calculator").doc(id);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      throw new Error("Document not found");
    }

    const data = docSnapshot.data();
    console.log(data);

    // Update the "actual" field by adding the newActual value to the existing one
    const newAmount = data.actual + newActual;
    const newBalance = data.sum - newAmount;
    console.log(newAmount);
    batch.update(docRef, {
      actual: newAmount,
      balance: newBalance,
    });

    console.log("Calculator actual updated successfully");
  } catch (error) {
    console.log("Error updating Calculator actual:", error);
  }
};

module.exports = updateCalculatorActual;
