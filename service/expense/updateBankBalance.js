/**
 * Update the bank's balance by adding a specified amount.
 *
 * @param {string} bankId - The ID of the bank for which to update the balance.
 * @param {number} amount - The amount to be added to the balance.
 * @param {Firestore} db - The Firestore database reference.
 * @param {WriteBatch} batch - The Firestore batch.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
const updateBankBalance = async (bankId, amount, db, batch) => {
  const docRef = db.collection("finance").doc(bankId);

  try {
    // Get the document data
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      console.log("Bank document does not exist.");
      return;
    }

    const currentBalance = docSnapshot.data().balance || 0; // Default to 0 if the field doesn't exist

    // Calculate the new balance by adding the new amount
    const updatedBalance = currentBalance + parseInt(amount);

    // Update the document with the new balance using the batch
    batch.update(docRef, { balance: updatedBalance });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    throw new Error("Failed to update bank balance.");
  }
};

module.exports = updateBankBalance;
