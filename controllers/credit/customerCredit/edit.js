const admin = require("../../../config/firebase-admin");
const updateCreditDocument = require("../../../service/credit/totalCredit/updateCreditDocument");
const updateCalculator = require("../../../service/credit/updateCalculator/updateCalculator");

/**
 * Edit a credit document and perform related operations.
 *
 * @param {Object} req - Express.js request object containing the updated credit data in the body.
 * @param {Object} res - Express.js response object.
 * @returns {Object} JSON response indicating success or failure.
 */
const editCredit = async (req, res) => {
  const db = admin.firestore();
  const batch = db.batch();

  try {
    const creditId = req.params.creditId;
    const updatedData = req.body;
    const newValue = updatedData.difference;
    delete updatedData.difference;
    if (!creditId) {
      return res
        .status(400)
        .json({
          message:
            "Request body is missing or empty.Please refresh your browser and try again.",
        });
    }

    if (!updatedData) {
      return res
        .status(400)
        .json({
          message:
            "Updated data is missing or empty.Please refresh your browser and try again.",
        });
    }

    console.log(updatedData);

    // Edit the existing credit document in the "CustomerCredit" collection within the batch
    const creditRef = db.collection("CustomerCredit").doc(creditId);
    batch.update(creditRef, updatedData);

    // Update the total credit and retrieve the updated total within the batch
    const newTotalCredit = await updateCreditDocument(
      updatedData.branchId,
      "CustomerCredit",
      parseFloat(newValue ? newValue : 0),
      db,
      batch
    );

    if (newTotalCredit) {
      // Update the calculator with the new total credit within the batch
      await updateCalculator(
        updatedData.active,
        parseFloat(newTotalCredit.total ? newTotalCredit.total : 0),
        db,
        batch
      );
    }
    // print(manye);
    // Commit the batch to apply the changes
    await batch.commit();

    // Respond with a success message
    res.status(200).json({ message: `CustomerCredit Edited successfully.` });
  } catch (error) {
    console.error(error);

    // Respond with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = editCredit;
