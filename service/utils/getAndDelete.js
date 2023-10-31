const getDocumentByBranchAndThenDelete = async (
  collectionName,
  branchIdValue,
  db,
  batch
) => {
  const collectionRef = db.collection(collectionName);

  try {
    const querySnapshot = await collectionRef
      .where("branchId", "==", branchIdValue)
      .get();

    // Merge the results from both queries
    const documents = [];

    querySnapshot.forEach((doc) => {
      const documentData = doc.data();
      documents.push(documentData);

      // Queue the document for deletion within the batch
      const documentRef = doc.ref;
      batch.delete(documentRef);
    });
    // Commit the batch to delete the documents atomically

    return documents;
  } catch (error) {
    console.error("Error retrieving or deleting documents:", error);
    return [];
  }
};

module.exports = getDocumentByBranchAndThenDelete;
