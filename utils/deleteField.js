const admin = require("../config/firebase-admin");

const deleteField = async (fieldName, id, collection) => {
  const db = admin.firestore();
  const docRef = db.collection(collection).doc(id);

  try {
    const snapshot = await docRef.get();

    if (snapshot.exists) {
      const data = snapshot.data();
      if (data[fieldName] !== undefined) {
        delete data[fieldName];
        console.log(data);
        await docRef.set(data);
        console.log(`Field "${fieldName}" deleted successfully.`);
      } else {
        console.log(`Field "${fieldName}" does not exist.`);
      }
    } else {
      console.log("Document does not exist.");
    }
  } catch (error) {
    console.error("Error deleting field:", error);
  }
};

module.exports = deleteField;
