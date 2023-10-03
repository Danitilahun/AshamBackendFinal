const admin = require("../config/firebase-admin");

const getDocumentByTwoFeature = async (value1, value2) => {
  try {
    // Get a reference to Firestore
    const firestore = admin.firestore();
    // Create a query to fetch the document based on branchId and date
    const querySnapshot = await firestore
      .collection("sheets")
      .where("branchId", "==", value1)
      .where("sheetNumber", "==", value2)
      .get();

    if (querySnapshot.empty) {
      // No document found
      return null;
    } else {
      // Return the first document found (assuming there's only one document matching the query)
      const documentData = querySnapshot.docs[0].data();
      return documentData;
    }
  } catch (error) {
    throw new Error(`Error getting document: ${error.message}`);
  }
};

module.exports = getDocumentByTwoFeature;
