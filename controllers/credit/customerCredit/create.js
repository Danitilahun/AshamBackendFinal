const admin = require("../../../config/firebase-admin");
const updateCreditDocument = require("../../../service/credit/totalCredit/updateCreditDocument");
const updateCalculator = require("../../../service/credit/updateCalculator/updateCalculator");
const createDocument = require("../../../service/mainCRUD/createDoc");
/**
 * Create a credit document and perform related operations.
 *
 * @param {Object} req - Express.js request object containing the credit data in the body.
 * @param {Object} res - Express.js response object.
 * @returns {Object} JSON response indicating success or failure.
 */
const createCredit = async (req, res) => {
  try {
    const data = req.body;
    // console.log(data);
    if (!data || !data.branchId || !data.active) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }

    // Get the Firestore instance and create a batch
    const db = admin.firestore();
    const batch = db.batch();

    // Create a new credit document in the "CustomerCredit" collection
    data.borrowedOn = new Date();
    data.daysSinceBorrowed = 0;
    await createDocument("CustomerCredit", data, db, batch);

    // Update the total credit and retrieve the updated total
    const newTotalCredit = await updateCreditDocument(
      data.branchId,
      "CustomerCredit",
      parseFloat(data.amount ? data.amount : 0),
      db,
      batch
    );
    // console.log("new total ", newTotalCredit.total);

    // Update the calculator with the new total credit
    if (newTotalCredit && newTotalCredit?.total) {
      await updateCalculator(data.active, newTotalCredit?.total, db, batch);
    }
    // print(manye);
    // Commit the batch
    await batch.commit();

    // Respond with a success message
    res.status(200).json({ message: `CustomerCredit Created successfully.` });
  } catch (error) {
    console.error(error);

    // Respond with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = createCredit;
