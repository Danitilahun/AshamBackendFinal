const updateStatusToCompleted = async (
  collectionName,
  branchId,
  deliveryguyId,
  date,
  status,
  db,
  batch
) => {
  try {
    const collectionRef = db.collection(collectionName);

    let query = collectionRef;

    // Apply filters based on provided parameters
    if (branchId) {
      query = query.where("branchId", "==", branchId);
    }
    if (deliveryguyId) {
      query = query.where("deliveryguyId", "==", deliveryguyId);
    }
    if (date) {
      query = query.where("date", "==", date);
    }

    if (status) {
      query = query.where("status", "==", status);
    }
    const querySnapshot = await query.get();

    querySnapshot.forEach((doc) => {
      const documentRef = collectionRef.doc(doc.id);
      batch.update(documentRef, { status: "Completed" });
    });

    console.log("Status updated to Completed for matching documents.");
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};

module.exports = updateStatusToCompleted;
