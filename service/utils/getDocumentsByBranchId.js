const admin = require("../../config/firebase-admin");

const db = admin.firestore();

const getDocumentsByBranchId = async (collectionName, branchIdValue) => {
  const collectionRef = db.collection(collectionName);

  try {
    const querySnapshot = await collectionRef
      .where("branchId", "==", branchIdValue)
      .get();
    const documents = [];

    querySnapshot.forEach((doc) => {
      documents.push(doc.data());
    });

    return documents;
  } catch (error) {
    console.error("Error retrieving documents:", error);
    return [];
  }
};

module.exports = getDocumentsByBranchId;
