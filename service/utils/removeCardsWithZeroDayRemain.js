const removeCardsWithZeroDayRemain = async (db, batch, branchId) => {
  try {
    const querySnapshot = await db
      .collection("Card")
      .where("dayRemain", "==", 0)
      .where("cardBranch", "==", branchId)
      .get();

    querySnapshot.forEach((doc) => {
      const documentRef = doc.ref;
      batch.delete(documentRef);
    });

    console.log("Documents with dayRemain=0 removed successfully.");
  } catch (error) {
    console.error("Error removing documents: ", error);
    throw error;
  }
};

module.exports = removeCardsWithZeroDayRemain;
