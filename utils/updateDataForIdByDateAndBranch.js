const admin = require("./firebase-admin");

const updateDataForIdByDateAndBranch = async (
  collectionName,
  date,
  branchId,
  idToUpdate,
  newData,
  idToUpdate2,
  newTotal
) => {
  const db = admin.firestore();

  try {
    console.log("date", date);
    console.log("branchId", branchId);
    console.log("idToUpdate", idToUpdate);
    console.log("newData", newData);
    console.log("collectionName", collectionName);
    // Query for the document based on date and branchId
    const querySnapshot = await db
      .collection(collectionName)
      .where("date", "==", date)
      .where("branchId", "==", branchId)
      .get();

    if (querySnapshot.empty) {
      console.log("Document not found.");
      return;
    }

    // Update the data for the specific ID in the found document
    const docRef = querySnapshot.docs[0].ref;
    console.log("docRef", docRef);

    // Create an object with the fields to update dynamically
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

module.exports = updateDataForIdByDateAndBranch;
