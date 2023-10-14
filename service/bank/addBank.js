const addBank = async (db, batch, documentId, fieldName, valueToAdd) => {
  try {
    if (!documentId) {
      throw new Error("You don't have sheet.Please create before.");
    }

    const docRef = db.collection("Bank").doc(documentId);
    const doc = await docRef.get();

    if (doc.exists) {
      const currentValue = doc.data()[fieldName] || 0;
      const newValue = currentValue + parseFloat(valueToAdd || 0);

      batch.update(docRef, { [fieldName]: newValue });
    }
    console.log("Field update added to batch");
  } catch (error) {
    throw error;
  }
};

module.exports = addBank;
