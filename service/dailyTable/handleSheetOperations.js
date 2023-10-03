// // sheetUtils.js

const generateCustomID = require("../../util/generateCustomID");
const pushToFieldArray = require("../../utils/pushToFieldArray");
const updateOrCreateFieldsInDocument = require("../utils/updateOrCreateFieldsInDocument");
const ChangeSheetTableCount = require("./incrementTableCount");

// // Function to handle sheet-related operations
// const handleSheetOperations = async (sheetId, date, branchId) => {
//   const customId1 = generateCustomID(`${date}-${sheetId}-${branchId}`);
//   await pushToFieldArray("sheets", sheetId, "tableDate", date);
//   await pushToFieldArray("sheets", sheetId, "Tables", customId1);
//   await ChangeSheetTableCount("sheets", sheetId, 1);
//   await updateOrCreateFieldsInDocument("branches", branchId, {
//     activeTable: customId1,
//   });
// };

// module.exports = handleSheetOperations;

/**
 * Function to handle sheet-related operations.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} sheetId - The sheet ID.
 * @param {string} date - The date.
 * @param {string} branchId - The branch ID.
 */
const handleSheetOperations = async (db, batch, sheetId, date, branchId) => {
  if (!branchId || !sheetId || !date) {
    return null;
  }
  const customId1 = generateCustomID(`${date}-${sheetId}-${branchId}`);
  // Add the update operations to the batch
  const sheetTableDateField = `tableDate`;
  const sheetTablesField = `Tables`;

  await pushToFieldArray(
    db,
    batch,
    "sheets",
    sheetId,
    sheetTableDateField,
    date
  );
  await pushToFieldArray(
    db,
    batch,
    "sheets",
    sheetId,
    sheetTablesField,
    customId1
  );
  await ChangeSheetTableCount(db, batch, "sheets", sheetId, 1);
  await updateOrCreateFieldsInDocument(db, batch, "branches", branchId, {
    activeTable: customId1,
  });
};

module.exports = handleSheetOperations;
