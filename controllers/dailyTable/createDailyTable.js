const admin = require("../../config/firebase-admin");
const addDayToDaily15DaySummerySheet = require("../../service/dailyTable/addDayToDaily15DaySummerySheet");
const handleDeliveryOperations = require("../../service/dailyTable/handleDeliveryOperations");
const handleSheetOperations = require("../../service/dailyTable/handleSheetOperations");
const checkDocumentExistsInTable = require("../../service/utils/checkDocumentExistsInTable");
const getDocumentDataById = require("../../service/utils/getDocumentDataById");
const updateCardCollection = require("../../service/utils/updateCardCollection");
const generateCustomID = require("../../util/generateCustomID");

/**
 * Create a new table and perform related operations.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} JSON response with the table creation result.
 */
const createTable = async (req, res) => {
  const { date, sheetId, branchId } = req.body;

  try {
    if (!date || !sheetId || !branchId) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
        type: "info",
      });
    }
    // Step 1: Get sheet data by ID
    const documentData = await getDocumentDataById("sheets", sheetId);
    if (!documentData) {
      return res.status(404).json({
        message: "Sheet document not found.",
        type: "info",
      });
    }

    // Step 2: Check the number of tables on the sheet
    const count = documentData.tablecount;
    if (count == 15) {
      return res.status(400).json({
        message:
          "There are already 15 tables on this sheet. Create another one.",
        type: "info",
      });
    }

    // Step 3: Generate custom ID for the table
    const customId1 = generateCustomID(`${date}-${sheetId}-${branchId}`);
    // Step 4: Check if the table with the given date already exists
    const table1Exists = await checkDocumentExistsInTable(customId1);

    if (table1Exists) {
      return res.status(400).json({
        message: "The table with the given date already exists.",
        type: "info",
      });
    } else {
      // Step 5: Handle delivery operations
      const db = admin.firestore();
      const batch = db.batch();
      await handleDeliveryOperations(db, batch, branchId, sheetId, date);

      // Step 6: Handle sheet operations
      await handleSheetOperations(db, batch, sheetId, date, branchId);

      // Step 7: Add the day to the daily 15-day summary sheet
      await addDayToDaily15DaySummerySheet(db, batch, sheetId, branchId, date);

      const branch = await getDocumentDataById("branches", branchId);
      if (!branch.cardPaid) {
        await updateCardCollection(db, batch, branchId);
      }
      // Commit the batch
      await batch.commit();
    }

    // Step 8: Send success response
    res.json({
      id: customId1,
      message: "Table collection created successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "An error occurred while creating works collection and tables collection.",
    });
  }
};

module.exports = createTable;
