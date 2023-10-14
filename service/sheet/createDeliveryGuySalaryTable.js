const getAllDeliveryGuysByBranchId = require("../utils/getAllDeliveryGuysByBranchId");
const getDeliveryGuySalaryMapping = require("../utils/getDeliveryGuySalaryMapping");

/**
 * Creates the delivery guy salary table and adds it to the "salary" collection.
 * @param {string} customId1 - The custom ID 1.
 * @param {string} sheetId - The sheet ID.
 * @param {string} branchId - The branch ID.
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @returns {Promise<void>} A Promise that resolves when the delivery guy salary table is created.
 */
const createDeliveryGuySalaryTable = async (
  customId1,
  sheetId,
  branchId,
  db,
  batch
) => {
  try {
    if (!branchId || !sheetId || !customId1) {
      throw new Error(
        "Required parameters are missing.Please check your connection and try again."
      );
    }
    const deliveryGuyIds = await getAllDeliveryGuysByBranchId(
      "deliveryguy",
      branchId
    );
    // Add "total" entry to deliveryGuyIds
    deliveryGuyIds.push({ id: "total", uniqueName: "total", name: "total" });

    const deliveryToWorkMappingSalary = await getDeliveryGuySalaryMapping(
      deliveryGuyIds
    );

    deliveryToWorkMappingSalary["sheetId"] = sheetId;
    deliveryToWorkMappingSalary["branchId"] = branchId;

    // Get the document reference
    const documentRef = db.collection("salary").doc(customId1);

    // Add the set operation to the batch
    batch.set(documentRef, deliveryToWorkMappingSalary);
  } catch (error) {
    console.error("Error in createDeliveryGuySalaryTable:", error);
    throw error; // Re-throw the error to be handled at the caller's level
  }
};

module.exports = createDeliveryGuySalaryTable;
