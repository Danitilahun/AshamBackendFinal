const updateCalculatorBank = async (db, batch, id, valueToAdd) => {
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

    // Add the operation to the batch
    batch.update(docRef, {
      actual: newActual,
      balance: newBalance,
      bank: valueToAdd,
    });

    console.log("Calculator updated successfully");
  } catch (error) {
    console.log("Error updating Calculator bank:", error);
  }
};

module.exports = updateCalculatorBank;
