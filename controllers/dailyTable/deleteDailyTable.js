// const admin = require("../../config/firebase-admin");
// const ChangeSheetTableCount = require("../../service/dailyTable/incrementTableCount");
// const popElementsAndUpdateCount = require("../../service/dailyTable/popElementsAndUpdateCount");
// const deleteDocument = require("../../service/mainCRUD/deleteDoc");
// const deleteField = require("../../service/utils/deleteField");
// const getDocumentDataById = require("../../service/utils/getDocumentDataById");
// const updateOrCreateFieldsInDocument = require("../../service/utils/updateOrCreateFieldsInDocument");

// const DeleteTable = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const tableData = await getDocumentDataById("tables", id);
//     if (tableData.total.total > 0) {
//       return res.status(409).json({
//         message: "Table has some data. You can't delete it.",
//         type: "info",
//       });
//     }
//     await deleteDocument("tables", id);
//     await deleteField("tables", tableData.activeDailySummery, tableData.date);
//     const branchData = await getDocumentDataById(
//       "branches",
//       tableData.branchId
//     );
//     if (branchData.activeTable === id) {
//       await updateOrCreateFieldsInDocument("branches", tableData.branchId, {
//         activeTable: "",
//       });
//     }

//     await popElementsAndUpdateCount(
//       db,
//       batch,
//       "sheets",
//       tableData.sheetId,
//       "tableDate",
//       "Tables",
//       tableData.date,
//       id,
//       -1
//     );
//     res.status(200).json({ message: "Table Deleted SuccessFully" });
//   } catch (error) {
//     res.status(404).json({ error: "Document not found." });
//   }
// };

// module.exports = DeleteTable;

const admin = require("../../config/firebase-admin");
const popElementsAndUpdateCount = require("../../service/dailyTable/popElementsAndUpdateCount");
const deleteDocument = require("../../service/mainCRUD/deleteDoc");
const deleteField = require("../../service/utils/deleteField");
const getDocumentDataById = require("../../service/utils/getDocumentDataById");
const updateOrCreateFieldsInDocument = require("../../service/utils/updateOrCreateFieldsInDocument");

/**
 * Delete a table and perform related operations.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const DeleteTable = async (req, res) => {
  const { id } = req.params;

  try {
    const db = admin.firestore();
    const batch = db.batch();

    if (!db || !batch) {
      return res.status(500).json({ error: "Database initialization failed." });
    }

    const tableData = await getDocumentDataById("tables", id);
    if (!tableData) {
      return res.status(404).json({ error: "Table not found." });
    }

    if (tableData.total.total > 0) {
      return res.status(409).json({
        message: "Table has some data. You can't delete it.",
        type: "info",
      });
    }

    await deleteDocument(db, batch, "tables", id);
    await deleteField(
      db,
      batch,
      "tables",
      tableData.activeDailySummery,
      tableData.date
    );
    const branchData = await getDocumentDataById(
      "branches",
      tableData.branchId
    );

    if (branchData && branchData.activeTable === id) {
      await updateOrCreateFieldsInDocument(
        db,
        batch,
        "branches",
        tableData.branchId,
        {
          activeTable: "",
        }
      );
    }

    await popElementsAndUpdateCount(
      db,
      batch,
      "sheets",
      tableData.sheetId,
      "tableDate",
      "Tables",
      tableData.date,
      id,
      -1
    );

    // print(manye);
    // Commit the batch
    await batch.commit();

    res.status(200).json({ message: "Table Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = DeleteTable;
