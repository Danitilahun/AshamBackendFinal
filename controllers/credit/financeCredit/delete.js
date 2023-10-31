const admin = require("../../../config/firebase-admin");
const updateCreditDocument = require("../../../service/credit/totalCredit/updateCreditDocument");
const updateCalculator = require("../../../service/credit/updateCalculator/updateCalculator");
const updateBankCredit = require("../../../service/expense/updateBankCredit");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");

/**
 * Delete a finance credit document and perform related operations.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
const deleteFinanceCredit = async (req, res) => {
  const db = admin.firestore();
  const batch = db.batch();

  try {
    // Get document ID from the request parameters
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message:
          "Request parameters are missing or empty.Please refresh your browser and try again.",
      });
    }
    // Get credit data before deleting for updating total credit
    const credit = await getDocumentDataById("FinanceCredit", id);

    // If credit data is null, respond with an error message
    if (!credit) {
      return res.status(404).json({ message: "Finance Credit not found." });
    }

    // Delete the finance credit document from the "FinanceCredit" collection within the batch
    const financeCreditRef = db.collection("FinanceCredit").doc(id);
    batch.delete(financeCreditRef);

    // Update the total credit by subtracting the deleted credit amount within the batch
    const updatedTotalCredit = await updateCreditDocument(
      credit.branchId,
      "StaffCredit",
      -parseFloat(credit.amount),
      db,
      batch
    );

    // Update the calculator with the new total credit within the batch
    if (updatedTotalCredit) {
      // await updateCalculator(
      //   credit.branchId,
      //   parseFloat(updatedTotalCredit.total),
      //   db,
      //   batch
      // );
      await updateBankCredit(
        credit.branchId,
        parseFloat(updatedTotalCredit.total),
        db,
        batch
      );
    }

    // Commit the batch to apply all the changes
    await batch.commit();

    // Respond with a success message
    res.status(200).json({ message: "Finance Credit deleted successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteFinanceCredit;
