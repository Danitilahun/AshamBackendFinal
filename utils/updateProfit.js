const admin = require("../config/firebase-admin");

const updateProfit = async (collectionName, docId, newValue) => {
  const db = admin.firestore();
  const docRef = db.collection(collectionName).doc(docId);
  try {
    const docSnapshot = await docRef.get();
    if (docSnapshot.exists) {
      await docRef.update({ profit: newValue });
      return `Updated 'active' field for document ${docId}`;
    } else {
      await docRef.set({ profit: newValue }, { merge: true });
      return `Created document ${docId} with 'active' field`;
    }
  } catch (error) {
    throw new Error(`Error updating/creating document ${docId}: ${error}`);
  }
};
module.exports = updateProfit;
