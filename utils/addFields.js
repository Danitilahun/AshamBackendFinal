const admin = require("../config/firebase-admin");

const addFields = async (collectionName, branchId, date, newData) => {
  try {
    // Get a reference to Firestore
    const firestore = admin.firestore();

    // Create a query to fetch the document based on branchId and date
    const querySnapshot = await firestore
      .collection(collectionName)
      .where("branchId", "==", branchId)
      .where("date", "==", date)
      .get();

    if (querySnapshot.empty) {
      // No document found
      throw new Error("Document not found");
    } else {
      // Return the first document found (assuming there's only one document matching the query)
      const documentRef = querySnapshot.docs[0].ref;

      // Merge the new data with the existing document data
      await documentRef.set(
        { ...querySnapshot.docs[0].data(), ...newData },
        { merge: true }
      );

      console.log("Fields added successfully.");

      // Return the updated document data
      return { ...querySnapshot.docs[0].data(), ...newData };
    }
  } catch (error) {
    throw new Error(`Error getting/updating document: ${error.message}`);
  }
};

module.exports = addFields;
