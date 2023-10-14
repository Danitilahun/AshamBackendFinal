const admin = require("../../config/firebase-admin");

const checkDocumentExistsInTable = async (tableId) => {
  try {
    const tableDocRef = admin.firestore().collection("tables").doc(tableId);
    const tableDocSnapshot = await tableDocRef.get();

    return tableDocSnapshot.exists;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = checkDocumentExistsInTable;
