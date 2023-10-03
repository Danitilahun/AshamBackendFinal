const admin = require("../config/firebase-admin");
const getCountOfDocuments = async (collectionName) => {
  const db = admin.firestore();

  const querySnapshot = await db.collectionGroup(collectionName).get();
  const count = querySnapshot.size;

  return count;
};
module.exports = getCountOfDocuments;
