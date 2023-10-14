const getDeliveryGuyWorkData = require("../../util/getDeliveryGuyWorkData");
const admin = require("../../config/firebase-admin");

/**
 * Creates a daily summary sheet and adds it to the "tables" collection.
 * @param {string} sheetId - The sheet ID.
 * @param {string} branchId - The branch ID.
 * @param {string} customId2 - The custom ID 2.
 * @param {object} db - The Firestore database instance.
 * @param {object} batch - The Firestore batch object.
 */
const createDailySummarySheet = (sheetId, branchId, customId2, db, batch) => {
  try {
    if (!sheetId || !branchId || !customId2) {
      throw new Error(
        "Required parameters are missing.Please check your connection and try again."
      );
    }

    const deliveryGuyWorkData = getDeliveryGuyWorkData();
    deliveryGuyWorkData.uniqueName = "total";
    deliveryGuyWorkData.name = "total";

    const deliveryToWorkMappingSummary = {};
    deliveryToWorkMappingSummary.total = deliveryGuyWorkData;
    deliveryToWorkMappingSummary["sheetId"] = sheetId;
    deliveryToWorkMappingSummary["branchId"] = branchId;

    const tablesCollectionRef = db.collection("tables");
    const customDocRef = tablesCollectionRef.doc(customId2);

    batch.set(customDocRef, deliveryToWorkMappingSummary);
  } catch (error) {
    console.error("Error in createDailySummarySheet:", error);
    throw error; // Re-throw the error to be handled at the caller's level
  }
};

module.exports = createDailySummarySheet;
