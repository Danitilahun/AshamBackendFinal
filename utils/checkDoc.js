const admin = require("../config/firebase-admin");

const checkDocumentExistsInSalary = async (tableId, collection) => {
  try {
    const tableDocRef = admin.firestore().collection(collection).doc(tableId);
    const tableDocSnapshot = await tableDocRef.get();
    return tableDocSnapshot.exists;
  } catch (error) {
    console.error(error);
    throw new Error(
      "An error occurred while checking for the document in the table."
    );
  }
};

module.exports = checkDocumentExistsInSalary;
