/**
 * Update the finance expense by adding a specified amount.
 *
 * @param {string} branchId - The ID of the branch for which to update the expense.
 * @param {number} amount - The amount to be added to the expense.
 * @param {Firestore} db - The Firestore database reference.
 * @param {WriteBatch} batch - The Firestore batch.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
const updateFinanceExpense = async (branchId, amount, db, batch) => {
  if (!branchId) {
    throw new Error(
      "Unable to get finance information to update.Please refresh your browser and try again."
    );
  }
  const docRef = db.collection("finance").doc(branchId);

  try {
    // Get the document data
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      console.log("Document does not exist.");
      return;
    }

    const currentExpense = docSnapshot.data().totalExpense || 0; // Default to 0 if the field doesn't exist

    // Calculate the new totalExpense by adding the new amount
    const updatedExpense = currentExpense + parseInt(amount);

    // Update the document with the new totalExpense using the batch
    batch.update(docRef, { totalExpense: updatedExpense });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    throw error;
  }
};

module.exports = updateFinanceExpense;
