const admin = require("../../../config/firebase-admin");

const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const generateCustomID = require("../../../utils/generateCustomID");
const CardDistribute = require("./helper/cardDistribute");
const CardFee = require("./helper/cardFee");
const HotelProfit = require("./helper/hotelProfit");
const waterDistribute = require("./helper/waterDistribute");
const wifiDistribute = require("./helper/wifiDistribute");

/**
 * Delete a credit document and perform related operations.
 *
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 * @returns {Object} JSON response indicating success or failure.
 */
const deleteCredit = async (req, res) => {
  try {
    const creditId = req.params.creditId;

    // Create a Firestore batch
    const db = admin.firestore(); // Initialize Firestore database
    const batch = db.batch();

    // Retrieve the credit data before deleting for updating total credit
    const creditRef = db.collection("DailyCredit").doc(creditId);
    const creditData = await getDocumentDataById("DailyCredit", creditId);

    if (!creditData) {
      return res.status(404).json({ message: "Credit document not found." });
    }

    // Delete the credit document in the "CustomerCredit" collection
    const deliveryGuyRef = db
      .collection("deliveryguy")
      .doc(creditData.deliveryguyId);
    const newCreditAmount = -parseInt(creditData.amount);
    batch.update(deliveryGuyRef, {
      dailyCredit: admin.firestore.FieldValue.increment(newCreditAmount),
    });

    console.log(creditData);

    const CardFeeCheck = generateCustomID("cardFee_Report_Reason");
    const CardDistributeCheck = generateCustomID(
      "cardDistribute_Report_Reason"
    );
    const wifiDistributeCheck = generateCustomID(
      "wifiDistribute_Report_Reason"
    );
    const waterDistributeCheck = generateCustomID(
      "waterDistribute_Report_Reason"
    );
    const HotelProfitCheck = generateCustomID("hotelProfit_Report_Reason");

    // Pass db and batch to the functions

    if (creditData.source !== "Credit") {
      console.log(" i am here");
      if (creditData.CHECK_SOURCE === CardFeeCheck) {
        console.log("In fee");
        await CardFee(creditData, db, batch);
      } else if (creditData.CHECK_SOURCE === CardDistributeCheck) {
        await CardDistribute(creditData, db, batch);
      } else if (creditData.CHECK_SOURCE === wifiDistributeCheck) {
        await wifiDistribute(creditData, db, batch);
      } else if (creditData.CHECK_SOURCE === waterDistributeCheck) {
        await waterDistribute(creditData, db, batch);
      } else if (creditData.CHECK_SOURCE === HotelProfitCheck) {
        await HotelProfit(creditData, db, batch);
      }
    }

    // Delete the credit document in the "DailyCredit" collection using batch
    batch.delete(creditRef);

    // Commit the batch operations
    await batch.commit();

    // Respond with a success message
    res.status(200).json({ message: `DailyCredit Deleted successfully.` });
  } catch (error) {
    console.error(error);

    // Respond with an error message
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = deleteCredit;
