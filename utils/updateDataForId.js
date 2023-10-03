const admin = require("../config/firebase-admin");

const updateDataForId = async (
  collectionName,
  docId,
  idToUpdate,
  newData,
  idToUpdate2,
  newTotal
) => {
  const db = admin.firestore();

  try {
    // Get the document from the collection
    const docRef = db.collection(collectionName).doc(docId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      console.log("Document not found.");
      return;
    }

    // Update the data for the specific ID
    const updateData = {};
    Object.keys(newData).forEach((key) => {
      // Check if the field needs incrementing
      if (typeof newData[key] === "number") {
        updateData[`${idToUpdate}.${key}`] =
          admin.firestore.FieldValue.increment(newData[key]);
      } else {
        updateData[`${idToUpdate}.${key}`] = newData[key];
      }
    });

    await docRef.update(updateData);

    const updateData2 = {};
    Object.keys(newTotal).forEach((key) => {
      // Check if the field needs incrementing
      if (typeof newTotal[key] === "number") {
        updateData2[`${idToUpdate2}.${key}`] =
          admin.firestore.FieldValue.increment(newTotal[key]);
      } else {
        updateData2[`${idToUpdate2}.${key}`] = newTotal[key];
      }
    });

    await docRef.update(updateData2);

    console.log("Data updated successfully.");
  } catch (error) {
    console.error("Error updating data:", error);
  }
};

module.exports = updateDataForId;
