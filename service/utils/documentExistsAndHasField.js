const admin = require("../../config/firebase-admin");
const db = admin.firestore();

const documentExistsAndHasField = async (
  collectionPath,
  documentId,
  fieldName
) => {
  try {
    const docRef = db.collection(collectionPath).doc(documentId);
    const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      const data = docSnapshot.data();
      if (data && data.hasOwnProperty(fieldName)) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error checking document:", error);
    throw error;
  }
};

module.exports = documentExistsAndHasField;
