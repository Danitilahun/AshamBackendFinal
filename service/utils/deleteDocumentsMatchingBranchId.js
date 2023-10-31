const deleteDocumentsMatchingBranchId = async (
  branchId,
  collectionName,
  db,
  batch
) => {
  const collectionRef = db.collection(collectionName);

  try {
    const querySnapshot = await collectionRef
      .where("branchId", "==", branchId)
      .get();

    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    console.log(
      `Deleted documents in ${collectionName} where branchId equals ${branchId}`
    );
  } catch (error) {
    console.error("Error deleting documents:", error);
  }
};

module.exports = deleteDocumentsMatchingBranchId;
