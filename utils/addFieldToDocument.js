const admin = require("../config/firebase-admin");

const addFieldToDocument = async (
  collectionName,
  documentId,
  fieldName,
  fieldValue
) => {
  const db = admin.firestore();

  const docRef = db.collection(collectionName).doc(documentId);

  try {
    await docRef.update({
      [fieldName]: fieldValue,
    });

    return true; // Success
  } catch (error) {
    console.error("Error adding field:", error);
    throw new Error("An error occurred while adding the field.");
  }
};

module.exports = addFieldToDocument;
