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
    if (!id) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }
    const db = admin.firestore();
    const batch = db.batch();

    const tableData = await getDocumentDataById("tables", id);
    if (!tableData) {
      return res.status(404).json({ error: "Table not found." });
    }
    const hasValueGreaterThanOne = Object.values(tableData.total).some(
      (value) => value > 1
    );
    if (hasValueGreaterThanOne > 0) {
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

    // Commit the batch
    await batch.commit();

    res.status(200).json({ message: "Table Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = DeleteTable;
