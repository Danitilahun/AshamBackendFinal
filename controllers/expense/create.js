const updateFinanceExpense = require("../../service/expense/updateFinanceExpense");
const createDocument = require("../../service/mainCRUD/createDoc");

const admin = require("../../config/firebase-admin");

/**
 * Create an expense document in the "expense" Firestore collection.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
const createExpense = async (req, res) => {
  try {
    // Get data from the request body
    const data = req.body;

    // Get Firestore database reference and create a batch
    const db = admin.firestore();
    const batch = db.batch();

    // Create an expense document in the "expense" collection using the batch
    await createDocument("Expense", data, db, batch);

    // Update finance expense with batch
    await updateFinanceExpense(data.financeId, data.amount, db, batch);

    // Commit the batch
    await batch.commit();

    // Respond with a success message
    res.status(200).json({ message: "Expense document created successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = createExpense;
