const admin = require("../../../config/firebase-admin");
const updateCreditDocument = require("../../../service/credit/totalCredit/updateCreditDocument");
const updateCalculator = require("../../../service/credit/updateCalculator/updateCalculator");
const updateBankCredit = require("../../../service/expense/updateBankCredit");
const createDocument = require("../../../service/mainCRUD/createDoc");

/**
 * Create an essential document in the "essential" Firestore collection.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
const createFinanceCredit = async (req, res) => {
  const db = admin.firestore();
  const batch = db.batch();

  try {
    // Get data from the request body
    const data = req.body;
    console.log(data);
    if (!data) {
      return res
        .status(400)
        .json({ message: "Request body is missing or empty." });
    }

    // Create an essential document in the "essential" collection within the batch
    await createDocument("FinanceCredit", data, db, batch);

    // Update the total credit and retrieve the updated total within the batch
    const totalCredit = await updateCreditDocument(
      data.branchId,
      "StaffCredit",
      parseFloat(data?.amount),
      db,
      batch
    );
    // Update the calculator with the new total credit within the batch

    if (totalCredit) {
      await updateCalculator(
        data.branchId,
        parseFloat(totalCredit.total),
        db,
        batch
      );
      await updateBankCredit(
        data.branchId,
        parseFloat(totalCredit.total),
        db,
        batch
      );
    }

    // Commit the batch to apply the changes
    await batch.commit();

    // Respond with a success message
    res.status(200).json({ message: "Finance Credit created successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = createFinanceCredit;
