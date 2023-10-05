const admin = require("../../config/firebase-admin");
const updateFinanceExpense = require("../../service/expense/updateFinanceExpense");
const deleteDocument = require("../../service/mainCRUD/deleteDoc");
const getDocumentDataById = require("../../service/utils/getDocumentDataById");

/**
 * Delete an expense document from the "expense" Firestore collection.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Firestore} db - The Firestore database reference.
 * @param {WriteBatch} batch - The Firestore batch.
 * @returns {void}
 */
const deleteExpense = async (req, res) => {
  try {
    const db = admin.firestore();
    const batch = db.batch();
    // Get document ID from the request parameters
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({
          message:
            "Request parameter is missing or empty.Please refresh your browser and try again.",
        });
    }
    const ExpenseData = await getDocumentDataById("Expense", id);

    // Delete the expense document from the "expense" collection using the batch
    await deleteDocument(db, batch, "Expense", id);

    // Update finance expense with batch (subtracting the deleted expense amount)
    await updateFinanceExpense(
      ExpenseData.financeId,
      -ExpenseData.amount,
      db,
      batch
    );

    // Commit the batch
    await batch.commit();
    // Respond with a success message
    res.status(200).json({ message: "Expense document deleted successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteExpense;
