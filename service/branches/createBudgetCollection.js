// createBudgetCollection.js
const admin = require("../../config/firebase-admin");

const createBudgetCollection = async (db, batch, branchId, budget) => {
  if (!branchId) {
    return;
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

// /**
//  * Create a Budget collection if it doesn't exist.
//  * @param {string} documentId - The document ID.
//  * @param {number} budget - The budget value.
//  * @returns {Promise<void>} A Promise that resolves when the operation is complete.
//  */
// const createBudgetCollection = async (documentId, budget) => {
//   if (!documentId) {
//     return null;
//   }
//   const db = admin.firestore();
//   const budgetCollectionRef = db.collection("Budget").doc(documentId);
//   const budgetDocumentSnapshot = await budgetCollectionRef.get();

//   if (!budgetDocumentSnapshot.exists) {
//     return budgetCollectionRef.set({
//       sheetSummary: [],
//       totalCredit: 0,
//       budget: budget,
//       total: 0,
//     });
//   }
// };

// module.exports = createBudgetCollection;
