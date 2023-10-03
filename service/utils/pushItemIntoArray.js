const admin = require("../../config/firebase-admin");

const pushToFieldArray = async (collectionName, docId, field, itemToPush) => {
  try {
    if (!docId) {
      return null;
    }
    // Get a reference to Firestore
    const firestore = admin.firestore();

    // Get the document reference
    const documentRef = firestore.collection(collectionName).doc(docId);

    // Get the current data of the document
    const documentSnapshot = await documentRef.get();
    if (!documentSnapshot.exists) {
      // No document found
      throw new Error("Document not found");
    }
    // Get the existing array from the 'date' field or an empty array if the field does not exist
    const existingDateArray = documentSnapshot.get(field) || [];

    // Check if itemToPush exists in the array
    if (!existingDateArray.includes(itemToPush)) {
      // Push the new item into the array
      existingDateArray.push(itemToPush);

      // Update the field with the updated array
      await documentRef.update({ [field]: existingDateArray });
      console.log(`Item added to the '${field}' array successfully.`);
    } else {
      console.log(
        `Item '${itemToPush}' already exists in the '${field}' array.`
      );
    }
    return documentSnapshot.data();
  } catch (error) {
    throw new Error(`Error getting/updating document: ${error.message}`);
  }
};

module.exports = pushToFieldArray;
