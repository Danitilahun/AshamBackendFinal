const admin = require("../config/firebase-admin");
const incrementFieldByOne = async (
  collectionName,
  documentId,
  fieldToIncrement,
  value
) => {
  const db = admin.firestore();

  const docRef = db.collection(collectionName).doc(documentId);

  const docSnapshot = await docRef.get();

  if (docSnapshot.exists) {
    const currentValue = docSnapshot.get(fieldToIncrement) || 0;
    const newValue = currentValue + value;

    await docRef.update({
      [fieldToIncrement]: newValue,
    });

    return newValue;
  }

  return null; // Document doesn't exist
};

module.exports = incrementFieldByOne;
