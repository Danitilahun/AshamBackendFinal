const admin = require("../../config/firebase-admin");
const updateFinanceExpense = require("../../service/expense/updateFinanceExpense");
const editDocument = require("../../service/mainCRUD/editDoc");

/**
 * Edit an expense document in the "expense" Firestore collection.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Firestore} db - The Firestore database reference.
 * @param {WriteBatch} batch - The Firestore batch.
 * @returns {void}
 */

const editExpense = async (req, res) => {
  try {
    const db = admin.firestore();
    const batch = db.batch();
    // Get document ID and updated data from the request body
    const updatedData = req.body;
    console.log(updatedData);
    const { id } = req.params;
    if (!id || !updatedData) {
      return res.status(400).json({
        message:
          "Request parameter is missing or empty.Please refresh your browser and try again.",
      });
    }
    const newAmount = updatedData.difference;
    delete updatedData.difference;

    // Edit the expense document in the "expense" collection using the batch
    await editDocument(db, batch, "Expense", id, updatedData);

    // Update finance expense with batch
    await updateFinanceExpense(updatedData.financeId, newAmount, db, batch);

    // Commit the batch
    await batch.commit();
    // Respond with a success message
    res.status(200).json({ message: "Expense document edited successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = editExpense;
