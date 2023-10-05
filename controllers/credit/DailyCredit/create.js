const admin = require("../../../config/firebase-admin");
const updateDeliveryGuy = require("../../../service/credit/updateDeliveryGuy/updateDeliveryGuy");
const createDocument = require("../../../service/mainCRUD/createDoc");
/**
 * Create a credit document and perform related operations.
 *
 * @param {Object} req - Express.js request object containing the credit data in the body.
 * @param {Object} res - Express.js response object.
 * @returns {Object} JSON response indicating success or failure.
 */
const createCredit = async (req, res) => {
  const db = admin.firestore();
  const batch = db.batch();

  try {
    const data = req.body;
    if (!data || !data.deliveryguyId) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }
    console.log(data);
    data.source = "Credit";

    // Create a new credit document in the "DailyCredit" collection within the batch

    await createDocument("DailyCredit", data, db, batch);

    // Update the delivery guy's document within the batch if the deliveryguyId is provided
    if (data.deliveryguyId) {
      await updateDeliveryGuy(
        db,
        batch,
        data.deliveryguyId,
        "dailyCredit",
        parseInt(data.amount ? data.amount : 0)
      );
    }

    // Commit the batch to apply all changes atomically
    await batch.commit();

    // Respond with a success message
    res.status(200).json({ message: `DailyCredit Created successfully.` });
  } catch (error) {
    console.error(error);

    // Respond with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = createCredit;
