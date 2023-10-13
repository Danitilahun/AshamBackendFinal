const admin = require("../../../config/firebase-admin");
const updateCreditDocument = require("../../../service/credit/totalCredit/updateCreditDocument");
const updateCalculator = require("../../../service/credit/updateCalculator/updateCalculator");

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
    if (!creditId) {
      return res.status(400).json({
        message:
          "Credit ID is missing or empty.Please refresh your browser and try again.",
      });
    }
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
    // const newCreditAmount = -parseInt(creditData.amount);
    // batch.update(deliveryGuyRef, {
    //   dailyCredit: admin.firestore.FieldValue.increment(newCreditAmount),
    // });
    const docSnapshot = await deliveryGuyRef.get();
    if (docSnapshot.exists) {
      // The delivery guy document exists, proceed with the update
      const newCreditAmount = -parseInt(
        creditData.amount ? creditData.gain : 0
      );
      batch.update(deliveryGuyRef, {
        dailyCredit: admin.firestore.FieldValue.increment(newCreditAmount),
      });
      // Success handling here, after the batch update is committed
      console.log("Credit update successful");
      // Send a response or perform any other actions as needed
    } else {
      // The delivery guy document does not exist, handle the error here
      throw new Error("Delivery guy does not exist");
    }

    // console.log(creditData);

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
      if (creditData.CHECK_SOURCE === CardFeeCheck) {
        await CardFee(creditData, db, batch);
      } else if (creditData.CHECK_SOURCE === CardDistributeCheck) {
        await CardDistribute(creditData, db, batch);
      } else if (creditData.CHECK_SOURCE === wifiDistributeCheck) {
        await wifiDistribute(creditData, db, batch);
      } else if (creditData.CHECK_SOURCE === waterDistributeCheck) {
        await waterDistribute(creditData, db, batch);
      } else if (creditData.CHECK_SOURCE === HotelProfitCheck) {
        await HotelProfit(creditData, db, batch);
      } else {
        // Update the total credit by subtracting the deleted credit amount
        const updatedTotalCredit = await updateCreditDocument(
          creditData.branchId,
          "DailyCredit",
          -parseFloat(creditData ? creditData.amount : 0), // Subtract the deleted credit amount
          db,
          batch
        );

        // Update the calculator with the new total credit
        if (updatedTotalCredit) {
          await updateCalculator(
            creditData.active,
            parseFloat(updatedTotalCredit.total ? updatedTotalCredit.total : 0),
            db,
            batch
          );
        }
      }
    } else {
      // Update the total credit by subtracting the deleted credit amount
      const updatedTotalCredit = await updateCreditDocument(
        creditData.branchId,
        "DailyCredit",
        -parseFloat(creditData ? creditData.amount : 0), // Subtract the deleted credit amount
        db,
        batch
      );

      // Update the calculator with the new total credit
      if (updatedTotalCredit) {
        await updateCalculator(
          creditData.active,
          parseFloat(updatedTotalCredit.total ? updatedTotalCredit.total : 0),
          db,
          batch
        );
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
