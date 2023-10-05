const createTotalCreditCollection = async (db, batch, branchId) => {
  if (!branchId) {
    throw new Error(
      "Unable to create total credit store because branch information is missing.Please refresh your browser and try again."
    );
  }
  try {
    const totalCreditCollectionRef = db.collection("totalCredit").doc(branchId);
    const totalCreditDocumentSnapshot = await totalCreditCollectionRef.get();

    if (!totalCreditDocumentSnapshot.exists) {
      // Create initial data for the total credit collection
      const totalCreditData = {
        CustomerCredit: 0,
        StaffCredit: 0,
        DailyCredit: 0,
        total: 0,
      };

      // Add the operation to the batch
      batch.set(totalCreditCollectionRef, totalCreditData);
    }
  } catch (error) {
    console.error("Error in createTotalCreditCollection:", error);
    throw error;
  }
};

module.exports = createTotalCreditCollection;
