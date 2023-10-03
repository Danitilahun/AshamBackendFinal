const admin = require("../config/firebase-admin");

const updateOrCreateDocument = async (
  collectionName,
  docId,
  fieldToUpdate,
  newValue
) => {
  const db = admin.firestore();
  const docRef = db.collection(collectionName).doc(docId);
  try {
    const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      const updateObject = {};
      updateObject[fieldToUpdate] = newValue;
      await docRef.update(updateObject);
      return `Updated '${fieldToUpdate}' field for document ${docId}`;
    } else {
      const setObject = {};
      setObject[fieldToUpdate] = newValue;
      await docRef.set(setObject, { merge: true });
      return `Created document ${docId} with '${fieldToUpdate}' field`;
    }
  } catch (error) {
    throw new Error(`Error updating/creating document ${docId}: ${error}`);
  }
};

module.exports = updateOrCreateDocument;
