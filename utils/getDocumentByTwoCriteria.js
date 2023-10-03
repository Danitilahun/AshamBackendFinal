const admin = require("../config/firebase-admin");
const getDocumentByTwoCriteria = async (
  collectionName,
  field1,
  value1,
  field2,
  value2
) => {
  const db = admin.firestore();
  try {
    // Query for the document based on the two criteria
    const querySnapshot = await db
      .collection(collectionName)
      .where(field2, "==", value2)
      .where(field1, "==", parseInt(value1))
      .get();

    if (querySnapshot.empty) {
      console.log("Document not found.");
      return null;
    }

    // Return the first document in the query result
    const doc = querySnapshot.docs[0];
    console.log("awfnksldmslk", doc.data());
    return { id: doc.id, data: doc.exists ? doc.data() : null };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

module.exports = getDocumentByTwoCriteria;
