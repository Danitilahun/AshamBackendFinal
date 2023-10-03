// dailySummerySheet.js

const generateCustomID = require("../../util/generateCustomID");
const getDeliveryGuyWorkData = require("../../util/getDeliveryGuyWorkData");
const addFieldToDocument = require("../utils/addFieldToDocument");

// // Function to add a day to the daily 15-day summary sheet
// const addDayToDaily15DaySummerySheet = async (sheetId, branchId, date) => {
//   const worksDocId = getDeliveryGuyWorkData();
//   worksDocId.uniqueName = date;
//   worksDocId.name = date;
//   const customId2 = generateCustomID(`${sheetId}-${branchId}-${"16day"}`);
//   await addFieldToDocument("tables", customId2, date, worksDocId);
// };

// module.exports = addDayToDaily15DaySummerySheet;

const addDayToDaily15DaySummerySheet = async (
  db,
  batch,
  sheetId,
  branchId,
  date
) => {
  if (!branchId || !sheetId || !date) {
    return null;
  }
  const worksDocId = getDeliveryGuyWorkData();
  worksDocId.uniqueName = date;
  worksDocId.name = date;
  const customId2 = generateCustomID(`${sheetId}-${branchId}-${"16day"}`);
  // Add the update operation to the batch
  await addFieldToDocument(db, batch, "tables", customId2, date, worksDocId);
};

module.exports = addDayToDaily15DaySummerySheet;
