const admin = require("../../config/firebase-admin");
const getAllDeliveryGuysByBranchId = require("../utils/getAllDeliveryGuysByBranchId");
const getDeliveryToWorkMapping = require("../utils/getDeliveryToWorkMapping");
// /**
//  * Creates individual delivery guy 15-day work summary and adds it to the "tables" collection.
//  * @param {string} sheetId - The sheet ID.
//  * @param {string} branchId - The branch ID.
//  * @param {string} customId2 - The custom ID 2.
//  * @returns {Promise<void>} A Promise that resolves when the summary is created.
//  */

// const createIndividualDeliveryGuy15DayWorkSummery = async (
//   sheetId,
//   branchId,
//   id
// ) => {
//   deliveryGuyIds = await getAllDeliveryGuysByBranchId("deliveryguy", branchId);
//   deliveryGuyIds.push({ id: "total", uniqueName: "total", name: "total" });

//   const deliveryToWorkMappingSummary = await getDeliveryToWorkMapping(
//     deliveryGuyIds
//   );

//   deliveryToWorkMappingSummary["sheetId"] = sheetId;
//   deliveryToWorkMappingSummary["branchId"] = branchId;

//   await admin
//     .firestore()
//     .collection("tables")
//     .doc(id)
//     .set(deliveryToWorkMappingSummary);
// };

// module.exports = createIndividualDeliveryGuy15DayWorkSummery;

/**
 * Creates individual delivery guy 15-day work summary and adds it to the "tables" collection.
 * @param {string} sheetId - The sheet ID.
 * @param {string} branchId - The branch ID.
 * @param {string} customId2 - The custom ID 2.
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @returns {Promise<void>} A Promise that resolves when the summary is created.
 */

const createIndividualDeliveryGuy15DayWorkSummery = async (
  sheetId,
  branchId,
  id,
  db,
  batch
) => {
  if (!branchId || !sheetId || !id) {
    return;
  }
  const deliveryGuyIds = await getAllDeliveryGuysByBranchId(
    "deliveryguy",
    branchId
  );
  deliveryGuyIds.push({ id: "total", uniqueName: "total", name: "total" });

  const deliveryToWorkMappingSummary = await getDeliveryToWorkMapping(
    deliveryGuyIds
  );

  deliveryToWorkMappingSummary["sheetId"] = sheetId;
  deliveryToWorkMappingSummary["branchId"] = branchId;

  // Get the document reference
  const documentRef = db.collection("tables").doc(id);

  // Add the set operation to the batch
  batch.set(documentRef, deliveryToWorkMappingSummary);
};

module.exports = createIndividualDeliveryGuy15DayWorkSummery;
