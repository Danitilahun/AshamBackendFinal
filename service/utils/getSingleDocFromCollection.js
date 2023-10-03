const admin = require("../../config/firebase-admin");

const getSingleDocFromCollection = async (collectionName) => {
  const db = admin.firestore();

  try {
    // Get the collection reference
    const collectionRef = db.collection(collectionName);

    // Get the document using the get method
    const querySnapshot = await collectionRef.get();

    if (querySnapshot.empty) {
      console.log("Collection is empty.");
      return null;
    }

    // Return the first document in the query result
    const doc = querySnapshot.docs[0];
    return doc.exists ? doc.data() : null;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

module.exports = getSingleDocFromCollection;
