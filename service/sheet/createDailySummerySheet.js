// const getDeliveryGuyWorkData = require("../../util/getDeliveryGuyWorkData");
// const admin = require("../../config/firebase-admin");
// /**
//  * Creates a daily summary sheet and adds it to the "tables" collection.
//  * @param {string} sheetId - The sheet ID.
//  * @param {string} branchId - The branch ID.
//  * @param {string} customId2 - The custom ID 2.
//  * @returns {Promise<void>} A Promise that resolves when the daily summary is created.
//  */
// const createDailySummarySheet = async (sheetId, branchId, customId2) => {
//   const deliveryGuyWorkData = getDeliveryGuyWorkData();
//   deliveryGuyWorkData.uniqueName = "total";
//   deliveryGuyWorkData.name = "total";

//   const deliveryToWorkMappingSummary = {};
//   deliveryToWorkMappingSummary.total = deliveryGuyWorkData;
//   deliveryToWorkMappingSummary["sheetId"] = sheetId;
//   deliveryToWorkMappingSummary["branchId"] = branchId;

//   await admin
//     .firestore()
//     .collection("tables")
//     .doc(customId2)
//     .set(deliveryToWorkMappingSummary);
// };

// module.exports = createDailySummarySheet;

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
  if (!sheetId || !branchId || !customId2) {
    return;
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
};

module.exports = createDailySummarySheet;
