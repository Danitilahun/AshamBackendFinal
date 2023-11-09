// const getDocumentByBranchOrCallcenterIdAndDelete = async (
//   collectionName,
//   branchIdValue,
//   db,
//   batch
// ) => {
//   const collectionRef = db.collection(collectionName);

//   try {
//     const querySnapshot = await collectionRef
//       .where("branchKey", "==", branchIdValue)
//       .get();

//     // Merge the results from both queries
//     const documents = [];

//     querySnapshot.forEach((doc) => {
//       const documentData = doc.data();
//       documents.push(documentData);
//     });

//     // Now, outside of the forEach loop, you can delete the documents in the batch
//     querySnapshot.forEach((doc) => {
//       const documentRef = doc.ref;
//       batch.delete(documentRef);
//     });
//     await batch.commit();
//     return documents;
//   } catch (error) {
//     console.error("Error retrieving or deleting documents:", error);
//     return [];
//   }
// };

// module.exports = getDocumentByBranchOrCallcenterIdAndDelete;
const getDocumentByBranchOrCallcenterIdAndDelete = async (
  collectionName,
  branchIdValue,
  db
) => {
  const collectionRef = db.collection(collectionName);
  const batch = db.batch(); // Create a new batch object

  try {
    const querySnapshot = await collectionRef
      .where("branchKey", "==", branchIdValue)
      .get();

    // Merge the results from both queries
    const documents = [];

    querySnapshot.forEach((doc) => {
      const documentData = doc.data();
      documents.push(documentData);
    });

    // Now, outside of the forEach loop, you can delete the documents in the batch
    querySnapshot.forEach((doc) => {
      const documentRef = doc.ref;
      batch.delete(documentRef);
    });

    await batch.commit(); // Commit the batch

    return documents;
  } catch (error) {
    console.error("Error retrieving or deleting documents:", error);
    return [];
  }
};

module.exports = getDocumentByBranchOrCallcenterIdAndDelete;
