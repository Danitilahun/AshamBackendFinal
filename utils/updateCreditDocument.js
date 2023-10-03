const admin = require("../config/firebase-admin");

const updateCreditDocument = async (customId, field, value) => {
  const db = admin.firestore();
  const creditRef = db.collection("totalCredit").doc(customId);

  // Check if the document exists
  const creditDoc = await creditRef.get();

  if (creditDoc.exists) {
    // Document exists, increment the specified field
    await creditRef.update({
      [field]: admin.firestore.FieldValue.increment(value),
      ["total"]: admin.firestore.FieldValue.increment(value),
    });
  } else {
    // Document doesn't exist, create a new one with initial data and increment the field
    const initialData = {
      CustomerCredit: 0,
      StaffCredit: 0,
      DailyCredit: 0,
      total: 0,
    };
    initialData[field] = value;
    initialData["total"] = value;
    await creditRef.set(initialData);
  }
};

module.exports = updateCreditDocument;
