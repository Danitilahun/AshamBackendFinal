const admin = require("../../../config/firebase-admin");
const updateCreditDocument = require("../../../service/credit/totalCredit/updateCreditDocument");
const updateCalculator = require("../../../service/credit/updateCalculator/updateCalculator");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");

/**
 * Delete a credit document and perform related operations.
 *
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 * @returns {Object} JSON response indicating success or failure.
 */

const deleteCredit = async (req, res) => {
  const db = admin.firestore();
  const batch = db.batch();

  try {
    const creditId = req.params.creditId;
    // Retrieve the credit data before deleting for updating total credit
    const creditData = await getDocumentDataById("CustomerCredit", creditId);

    // Delete the credit document in the "CustomerCredit" collection within the batch
    const creditRef = db.collection("CustomerCredit").doc(creditId);
    batch.delete(creditRef);

    // Update the total credit by subtracting the deleted credit amount
    const updatedTotalCredit = await updateCreditDocument(
      creditData.branchId,
      "CustomerCredit",
      -parseInt(creditData.amount), // Subtract the deleted credit amount
      db,
      batch
    );

    // Update the calculator with the new total credit
    if (updatedTotalCredit) {
      await updateCalculator(
        creditData.active,
        parseInt(updatedTotalCredit.total),
        db,
        batch
      );
    }
    // print(manye);
    // Commit the batch to apply the changes
    await batch.commit();

    // Respond with a success message
    res.status(200).json({ message: `CustomerCredit Deleted successfully.` });
  } catch (error) {
    console.error(error);

    // Respond with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteCredit;
