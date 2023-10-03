const admin = require("../config/firebase-admin");

const updateBankTransaction = async (
  customId,
  bankField,
  transactionField,
  valueToAddToBank,
  valueToAddToTransaction
) => {
  const db = admin.firestore();

  console.log(valueToAddToBank, valueToAddToTransaction);
  const creditRef = db.collection("Bank").doc(customId);
  // Check if the document exists
  const creditDoc = await creditRef.get();

  if (creditDoc.exists) {
    const updateData = {};
    // Update the bank field by adding the new value
    updateData[bankField] = (creditDoc.get(bankField) || 0) + valueToAddToBank;
    // Update the transaction field by adding the new value
    updateData[transactionField] =
      (creditDoc.get(transactionField) || 0) + valueToAddToTransaction;
    await creditRef.update(updateData);
    return updateData;
  }
  return null;
};

module.exports = updateBankTransaction;
