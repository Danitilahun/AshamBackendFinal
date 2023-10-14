// // // deliveryUtils.js
// const admin = require("../../config/firebase-admin");
// const generateCustomID = require("../../util/generateCustomID");
// const getAllDeliveryGuysByBranchId = require("../utils/getAllDeliveryGuysByBranchId");
// const getDeliveryToWorkMapping = require("../utils/getDeliveryToWorkMapping");

// // deliveryUtils.js
// /**
//  * Function to handle delivery-related operations.
//  *
//  * @param {Object} db - The Firestore database instance.
//  * @param {Object} batch - The Firestore batch object.
//  * @param {string} branchId - The branch ID.
//  * @param {string} sheetId - The sheet ID.
//  * @param {string} date - The date.
//  * @returns {string} The custom ID generated for the operation.
//  */
// const handleDeliveryOperations = async (db, batch, branchId, sheetId, date) => {
//   if (!branchId || !sheetId || !date) {
//     throw new Error(
//       "Required parameters are missing. Please check your connection and try again."
//     );
//   }
//   const customId1 = generateCustomID(`${date}-${sheetId}-${branchId}`);
//   const customId2 = generateCustomID(`${sheetId}-${branchId}`);
//   const customId3 = generateCustomID(`${sheetId}-${branchId}-${"16day"}`);
//   const deliveryGuyIds = await getAllDeliveryGuysByBranchId(
//     "deliveryguy",
//     branchId
//   );

//   console.log(deliveryGuyIds);

//   deliveryGuyIds.push({ id: "total", uniqueName: "total", name: "total" });
//   const deliveryToWorkMapping_normal = await getDeliveryToWorkMapping(
//     deliveryGuyIds
//   );

//   deliveryToWorkMapping_normal["sheetId"] = sheetId;
//   deliveryToWorkMapping_normal["branchId"] = branchId;
//   deliveryToWorkMapping_normal["date"] = date;
//   deliveryToWorkMapping_normal["active"] = customId2;
//   deliveryToWorkMapping_normal["activeDailySummery"] = customId3;

//   console.log("delivery_normal", deliveryToWorkMapping_normal);

//   // Add the update operation to the batch
//   const tableDocRef = db.collection("tables").doc(customId1);
//   batch.set(tableDocRef, deliveryToWorkMapping_normal);

//   return customId3;
// };

// module.exports = handleDeliveryOperations;

const admin = require("../../config/firebase-admin");
const generateCustomID = require("../../util/generateCustomID");
const getAllDeliveryGuysByBranchId = require("../utils/getAllDeliveryGuysByBranchId");
const getDeliveryToWorkMapping = require("../utils/getDeliveryToWorkMapping");

/**
 * Function to handle delivery-related operations.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} branchId - The branch ID.
 * @param {string} sheetId - The sheet ID.
 * @param {string} date - The date.
 * @returns {string} The custom ID generated for the operation.
 */
const handleDeliveryOperations = async (db, batch, branchId, sheetId, date) => {
  try {
    if (!branchId || !sheetId || !date) {
      throw new Error(
        "Required parameters are missing. Please check your connection and try again."
      );
    }
    const customId1 = generateCustomID(`${date}-${sheetId}-${branchId}`);
    const customId2 = generateCustomID(`${sheetId}-${branchId}`);
    const customId3 = generateCustomID(`${sheetId}-${branchId}-${"16day"}`);
    const deliveryGuyIds = await getAllDeliveryGuysByBranchId(
      "deliveryguy",
      branchId
    );

    console.log(deliveryGuyIds);

    deliveryGuyIds.push({ id: "total", uniqueName: "total", name: "total" });
    const deliveryToWorkMapping_normal = await getDeliveryToWorkMapping(
      deliveryGuyIds
    );

    deliveryToWorkMapping_normal["sheetId"] = sheetId;
    deliveryToWorkMapping_normal["branchId"] = branchId;
    deliveryToWorkMapping_normal["date"] = date;
    deliveryToWorkMapping_normal["active"] = customId2;
    deliveryToWorkMapping_normal["activeDailySummery"] = customId3;

    console.log("delivery_normal", deliveryToWorkMapping_normal);

    // Add the update operation to the batch
    const tableDocRef = db.collection("tables").doc(customId1);
    batch.set(tableDocRef, deliveryToWorkMapping_normal);

    return customId3;
  } catch (error) {
    console.error("Error in handleDeliveryOperations:", error);
    throw error; // Re-throw the error to be handled at the caller's level
  }
};

module.exports = handleDeliveryOperations;
