// createBudgetCollection.js
const admin = require("../../config/firebase-admin");

const createBudgetCollection = async (db, batch, branchId, budget) => {
  if (!branchId) {
    throw new Error(
      "Unable to create budget store because branch information is missing.Please refresh your browser and try again."
    );
  }
  try {
    const budgetCollectionRef = db.collection("Budget").doc(branchId);
    const budgetDocumentSnapshot = await budgetCollectionRef.get();

    if (!budgetDocumentSnapshot.exists) {
      // Create initial data for the budget collection
      const budgetData = {
        sheetSummary: [],
        totalCredit: 0,
        budget: budget,
        total: 0,
      };

      // Add the operation to the batch
      batch.set(budgetCollectionRef, budgetData);
    }
  } catch (error) {
    console.error("Error in createBudgetCollection:", error);
    throw error;
  }
};

module.exports = createBudgetCollection;
