const admin = require("../../config/firebase-admin");
const getAllDeliveryGuysByBranchId = require("../utils/getAllDeliveryGuysByBranchId");
const getDeliveryToWorkMapping = require("../utils/getDeliveryToWorkMapping");

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
  try {
    if (!branchId || !sheetId || !id) {
      throw new Error(
        "Required parameters are missing.Please check your connection and try again."
      );
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
  } catch (error) {
    console.error(
      "Error in createIndividualDeliveryGuy15DayWorkSummery:",
      error
    );
    throw error; // Re-throw the error to be handled at the caller's level
  }
};

module.exports = createIndividualDeliveryGuy15DayWorkSummery;
