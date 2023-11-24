const updateBankTransaction = async (
  db,
  batch,
  customId,
  bankField,
  transactionField,
  valueToAddToBank,
  valueToAddToTransaction
) => {
  try {
    if (!customId) {
      throw new Error(
        "Unable to update bank transaction for the branch because branch information is missing.Please refresh your browser and try again."
      );
    }
    const creditRef = db.collection("Bank").doc(customId);
    const creditDocumentSnapshot = await creditRef.get();

    if (creditDocumentSnapshot.exists) {
      const updateData = {};

      // Update the bank field by adding the new value
      updateData[bankField] =
        (creditDocumentSnapshot.get(bankField) || 0) + valueToAddToTransaction;

      // Update the transaction field by adding the new value
      const transactionValue =
        bankField === "Deposit" ? valueToAddToBank : -valueToAddToBank;
      updateData[transactionField] =
        (creditDocumentSnapshot.get(transactionField) || 0) + transactionValue;

      // Add the operation to the batch
      batch.update(creditRef, updateData);

      return updateData;
    }

    return null;
  } catch (error) {
    console.error("Error in updateBankTransaction:", error);
    throw error;
  }
};

module.exports = updateBankTransaction;
