// sheetUtils.js

const generateCustomID = require("../../util/generateCustomID");
const pushToFieldArray = require("../../utils/pushToFieldArray");
const updateOrCreateFieldsInDocument = require("../utils/updateOrCreateFieldsInDocument");
const ChangeSheetTableCount = require("./incrementTableCount");

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
  try {
    if (!branchId || !sheetId || !date) {
      throw new Error(
        "Required parameters are missing. Please check your connection and try again."
      );
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
      paid: false,
      cardPaid: true,
      cardDate: date,
    });
  } catch (error) {
    console.error("Error in handleSheetOperations:", error);
    throw error; // Re-throw the error to be handled at the caller's level
  }
};

module.exports = handleSheetOperations;
