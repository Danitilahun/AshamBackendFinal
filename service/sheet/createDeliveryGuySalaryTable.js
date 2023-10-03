const getAllDeliveryGuysByBranchId = require("../utils/getAllDeliveryGuysByBranchId");
const getDeliveryGuySalaryMapping = require("../utils/getDeliveryGuySalaryMapping");
// const admin = require("../../config/firebase-admin");
// /**
//  * Creates the delivery guy salary table and adds it to the "salary" collection.
//  * @param {string} customId1 - The custom ID 1.
//  * @param {string} sheetId - The sheet ID.
//  * @param {string} branchId - The branch ID.
//  * @returns {Promise<void>} A Promise that resolves when the delivery guy salary table is created.
//  */
// const createDeliveryGuySalaryTable = async (customId1, sheetId, branchId) => {
//   const deliveryGuyIds = await getAllDeliveryGuysByBranchId(
//     "deliveryguy",
//     branchId
//   );
//   // Add "total" entry to deliveryGuyIds
//   deliveryGuyIds.push({ id: "total", uniqueName: "total", name: "total" });

//   const deliveryToWorkMappingSalary = await getDeliveryGuySalaryMapping(
//     deliveryGuyIds
//   );

//   deliveryToWorkMappingSalary["sheetId"] = sheetId;
//   deliveryToWorkMappingSalary["branchId"] = branchId;

//   await admin
//     .firestore()
//     .collection("salary")
//     .doc(customId1)
//     .set(deliveryToWorkMappingSalary);
// };

// module.exports = createDeliveryGuySalaryTable;

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
  if (!branchId || !sheetId || !customId1) {
    return;
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
};

module.exports = createDeliveryGuySalaryTable;
