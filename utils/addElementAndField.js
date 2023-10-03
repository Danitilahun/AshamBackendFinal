const admin = require("../config/firebase-admin");

const addElementAndField = async (
  collectionName,
  documentId,
  newData,
  salary = 0
) => {
  try {
    // Get a reference to Firestore
    const firestore = admin.firestore();
    // Get the document reference
    const documentRef = firestore.collection(collectionName).doc(documentId);

    // Get the current data of the document
    const documentSnapshot = await documentRef.get();
    console.log(documentSnapshot.data());
    if (!documentSnapshot.exists) {
      // No document found
      throw new Error("Document not found");
    }

    // Merge the new data with the existing document data
    const old = documentSnapshot.data();
    old.total.fixedSalary = salary + old.total.fixedSalary;
    old.total.total = salary + old.total.total;
    console.log(newData);
    console.log(old);
    await documentRef.set({ ...old, ...newData }, { merge: true });

    console.log("Field added successfully.");

    // Return the updated document data
    return { ...old, ...newData };
  } catch (error) {
    throw new Error(`Error getting/updating document: ${error.message}`);
  }
};

module.exports = addElementAndField;
