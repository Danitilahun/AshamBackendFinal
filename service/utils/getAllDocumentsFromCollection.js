const admin = require("../../config/firebase-admin");

const db = admin.firestore();

const getAllDocumentsFromCollection = async (collectionName) => {
  const collectionRef = db.collection(collectionName);

  try {
    const querySnapshot = await collectionRef.get();
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

module.exports = getAllDocumentsFromCollection;
