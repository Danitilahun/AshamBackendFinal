const admin = require("../../../config/firebase-admin");
const updateCreditDocument = require("../../../service/credit/totalCredit/updateCreditDocument");
const updateCalculator = require("../../../service/credit/updateCalculator/updateCalculator");

/**
 * Edit a finance credit document and perform related operations.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
const editFinanceCredit = async (req, res) => {
  const db = admin.firestore();
  const batch = db.batch();

  try {
    // Get document ID and updated data from the request body
    const updatedData = req.body;
    const { id } = req.params;

    if (!updatedData) {
      return res
        .status(400)
        .json({ message: "Request body is missing or empty." });
    }
    // Fetch the finance credit document before editing for validation
    const financeCreditRef = db.collection("FinanceCredit").doc(id);
    const financeCreditSnapshot = await financeCreditRef.get();

    // If the document doesn't exist, respond with a 404 status code and an appropriate error message
    if (!financeCreditSnapshot.exists) {
      return res.status(404).json({ message: "Finance Credit not found." });
    }

    // Edit the finance credit document in the "FinanceCredit" collection within the batch
    batch.update(financeCreditRef, updatedData);

    // Update the total credit and the calculator within the batch
    const totalCredit = await updateCreditDocument(
      updatedData.branchId,
      "StaffCredit",
      parseFloat(updatedData.difference),
      db,
      batch
    );

    if (totalCredit) {
      await updateCalculator(
        updatedData.branchId,
        parseFloat(totalCredit.total),
        db,
        batch
      );
    }

    // Commit the batch to apply all the changes
    // await batch.commit();

    // Respond with a success message
    res.status(200).json({ message: "Finance Credit edited successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = editFinanceCredit;
