const updateBranchCalculatorBank = async (db, batch, id, valueToAdd) => {
  try {
    if (!id) {
      throw new Error(
        "Unable to update calculator information is not provided.Please refresh your browser and try again."
      );
    }

    const docRef = db.collection("Calculator").doc(id);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return null;
    }

    // Add the operation to the batch
    batch.update(docRef, {
      bank: valueToAdd,
    });

    console.log("Calculator updated successfully");
  } catch (error) {
    throw error;
  }
};

module.exports = updateBranchCalculatorBank;
