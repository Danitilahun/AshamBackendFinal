/**
 * Update the bank's credit by adding a specified amount.
 *
 * @param {string} bankId - The ID of the bank for which to update the credit.
 * @param {number} amount - The amount to be added to the credit.
 * @param {Firestore} db - The Firestore database reference.
 * @param {WriteBatch} batch - The Firestore batch.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
const updateBankCredit = async (bankId, amount, db, batch) => {
  const docRef = db.collection("finance").doc(bankId);

  try {
    // Get the document data
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      console.log("Bank document does not exist.");
      return;
    }

    const currentCredit = docSnapshot.data().credit || 0; // Default to 0 if the field doesn't exist

    // Calculate the new credit by adding the new amount
    const updatedCredit = currentCredit + parseInt(amount);

    // Update the document with the new credit using the batch
    batch.update(docRef, { credit: updatedCredit });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    throw new Error("Failed to update bank credit.");
  }
};

module.exports = updateBankCredit;
