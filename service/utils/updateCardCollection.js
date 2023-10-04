const getSingleDocFromCollection = require("./getSingleDocFromCollection");

const updateCardCollection = async (db, batch, branchId) => {
  try {
    // Get all documents from the "Card" collection where "dayRemain" > 0 and "branchId" is equal to the provided value
    const querySnapshot = await db
      .collection("Card")
      .where("dayRemain", ">", 0)
      .where("cardBranch", "==", branchId)
      .get();
    const companyGain = await getSingleDocFromCollection("companyGain");

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const remainMoney = data.remaingMoney - companyGain.card_price;
      const dayremain = parseInt(remainMoney / companyGain.card_price);

      // Update each document within the batch
      const cardRef = db.collection("Card").doc(doc.id);
      batch.update(cardRef, {
        remaingMoney: remainMoney,
        dayRemain: dayremain,
      });
    });

    console.log("All documents updated successfully.");
  } catch (error) {
    console.error("Error fetching or updating documents: ", error);
  }
};

module.exports = updateCardCollection;
