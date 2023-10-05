const handleDeliverGuyChange = require("../../../service/credit/handleEmployeeChange/handleDeliveryGuyChange");
const updateDeliveryGuy = require("../../../service/credit/updateDeliveryGuy/updateDeliveryGuy");
const editDocument = require("../../../service/mainCRUD/editDoc");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const admin = require("../../../config/firebase-admin");

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
    if (!creditId || !updatedData || !updatedData.deliveryguyId) {
      return res.status(400).json({
        message:
          "Request body is missing.Please refresh your browser and try again.",
      });
    }
    const prev = await getDocumentDataById("DailyCredit", creditId);
    if (prev.source === "Report") {
      return res.status(400).json({
        message: "You cannot edit this credit because it is from a report",
        type: "info",
      });
    }
    await handleDeliverGuyChange(db, batch, updatedData, creditId);
    // Edit the existing credit document in the "CustomerCredit" collection
    await editDocument(db, batch, "DailyCredit", creditId, updatedData);

    await updateDeliveryGuy(
      db,
      batch,
      updatedData.deliveryguyId,
      "dailyCredit",
      parseInt(newValue)
    );

    // Commit the batch update
    await batch.commit();

    // Respond with a success message
    res.status(200).json({ message: `DailyCredit Edited successfully.` });
  } catch (error) {
    console.error(error);

    // Respond with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = editCredit;
