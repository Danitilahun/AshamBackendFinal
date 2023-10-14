// // dailySummerySheet.js

// const generateCustomID = require("../../util/generateCustomID");
// const getDeliveryGuyWorkData = require("../../util/getDeliveryGuyWorkData");
// const addFieldToDocument = require("../utils/addFieldToDocument");

// const addDayToDaily15DaySummerySheet = async (
//   db,
//   batch,
//   sheetId,
//   branchId,
//   date
// ) => {
//   if (!branchId || !sheetId || !date) {
//     throw new Error(
//       "Required parameters are missing.Please check your connection and try again."
//     );
//   }
//   const worksDocId = getDeliveryGuyWorkData();
//   worksDocId.uniqueName = date;
//   worksDocId.name = date;
//   const customId2 = generateCustomID(`${sheetId}-${branchId}-${"16day"}`);
//   // Add the update operation to the batch
//   await addFieldToDocument(db, batch, "tables", customId2, date, worksDocId);
// };

// module.exports = addDayToDaily15DaySummerySheet;

const generateCustomID = require("../../util/generateCustomID");
const getDeliveryGuyWorkData = require("../../util/getDeliveryGuyWorkData");
const addFieldToDocument = require("../utils/addFieldToDocument");

const addDayToDaily15DaySummarySheet = async (
  db,
  batch,
  sheetId,
  branchId,
  date
) => {
  try {
    if (!branchId || !sheetId || !date) {
      throw new Error(
        "Required parameters are missing. Please check your connection and try again."
      );
    }
    const worksDocId = getDeliveryGuyWorkData();
    worksDocId.uniqueName = date;
    worksDocId.name = date;
    const customId2 = generateCustomID(`${sheetId}-${branchId}-${"16day"}`);
    // Add the update operation to the batch
    await addFieldToDocument(db, batch, "tables", customId2, date, worksDocId);
  } catch (error) {
    console.error("Error in addDayToDaily15DaySummarySheet:", error);
    throw error; // Re-throw the error to be handled at the caller's level
  }
};

module.exports = addDayToDaily15DaySummarySheet;
