const admin = require("../../config/firebase-admin");

const updateCalculatorBank = async (id, valueToAdd) => {
  const db = admin.firestore();
  try {
    if (!id) {
      return null;
    }
    const docRef = db.collection("Calculator").doc(id);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return null;
    }
    const data = docSnapshot.data();
    const newActual = data.actual + data.bank - valueToAdd;
    const newBalance = data.sum - newActual;

    await docRef.update({
      actual: newActual,
      balance: newBalance,
      bank: valueToAdd, // Change data.totalCredit to data.bank
    });

    console.log("Calculator updated successfully");
  } catch (error) {
    console.log("Error updating Calculator bank:", error);
  }
};

module.exports = updateCalculatorBank;
