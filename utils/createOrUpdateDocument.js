const admin = require("../config/firebase-admin");

const createOrUpdateDocument = async (collectionName, documentId, data) => {
  const db = admin.firestore();
  const docRef = db.collection(collectionName).doc(documentId);

  // Check if the document exists
  const docSnapshot = await docRef.get();
  try {
    if (docSnapshot.exists) {
      data[data.type] = "Yes";
      await docRef.update(data);
      console.log(`Document with ID ${documentId} updated.`);
    } else {
      // Document does not exist, create it
      data.Asbeza = "No";
      data.Wifi = "No";
      data.Card = "No";
      data.Water = "No";
      data[data.type] = "Yes";
      await docRef.set(data);
      console.log(`Document with ID ${documentId} created.`);
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to register customer.");
  }
};

module.exports = createOrUpdateDocument;
