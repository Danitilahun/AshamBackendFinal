const admin = require("../../config/firebase-admin");

const db = admin.firestore();

const getDocumentsByFinanceId = async (branchIdValue) => {
  const collectionRef = db.collection("Expense");

  try {
    const querySnapshot = await collectionRef
      .where("financeId", "==", branchIdValue)
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

module.exports = getDocumentsByFinanceId;
