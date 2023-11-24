const deleteBranchRelatedDoc = async (db, batch, id) => {
  try {
    if (!id) {
      throw new Error(
        "Unable to delete branch related documents because branch information is missing.Please refresh your browser and try again."
      );
    }
    // Step 1: Delete the "Bank" collection of the branch
    batch.delete(db.collection("Bank").doc(id));

    // Step 2: Delete the "Budget" collection of the branch
    batch.delete(db.collection("Budget").doc(id));

    // Step 3: Delete the "totalCredit" collection of the branch
    batch.delete(db.collection("totalCredit").doc(id));

    // Step 4: Delete delivery guys where branch field matches the provided id

    // Log success message if collections and delivery guys are deleted
    console.log(
      `Collections (Bank, Budget, totalCredit) and delivery guys deleted for branch ID: ${id}`
    );
  } catch (error) {
    // Log the error if any occurs
    console.error("Error deleting collections and delivery guys:", error);
    throw error;
  }
};

module.exports = deleteBranchRelatedDoc;
