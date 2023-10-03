const admin = require("../../config/firebase-admin");
const pushToFieldArray = require("../../service/bank/pushToFieldArray");
const updateBankTransaction = require("../../service/bank/updateBankTransaction");
const updateCalculatorBank = require("../../service/bank/updateCalculatorBank");
const updateBankBalance = require("../../service/expense/updateBankBalance");

/**
 * Create a bank transaction record and update related data.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
const CreateBank = async (req, res) => {
  const db = admin.firestore();
  const batch = db.batch(); // Create a Firestore batch

  try {
    // Extract data from the request body
    const data = req.body;
    console.log(data);

    // Check if data is null or undefined
    if (!data) {
      return res
        .status(400)
        .json({ message: "Request body is missing or empty." });
    }

    // Initialize Firestore database
    const branchesCollection = db.collection("Bank");

    // Adjust the transaction amount based on the type of transaction
    data.amount = data.transaction === "Withdraw" ? -data.amount : data.amount;

    // Set the transaction creation timestamp
    data.createdAt = admin.firestore.FieldValue.serverTimestamp();

    // Add the transaction data to the "Bank" collection within the batch
    const newTransactionRef = branchesCollection.doc();
    batch.set(newTransactionRef, data);

    // Update the bank transaction data for the specified branch within the batch
    const bank = await updateBankTransaction(
      db,
      batch,
      data.branchId,
      data.transactionType,
      "total",
      parseInt(data.amount),
      parseInt(data.amount)
    );

    console.log(bank);
    // Push the transaction data to a field array within the batch
    await pushToFieldArray(
      db,
      batch,
      data.source,
      data.branchId,
      "bank",
      data.bankName
    );

    // Update the calculator with bank data within the batch
    if (bank) {
      await updateCalculatorBank(db, batch, data.calculatorId, bank.total);
      await updateBankBalance(data.calculatorId, bank.total, db, batch);
    }

    // print(manye);
    // Commit the batch to execute all operations together
    await batch.commit();

    // Respond with a success message
    res.status(200).json({
      message: `Branch transaction recorded successfully.`,
    });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = CreateBank;
