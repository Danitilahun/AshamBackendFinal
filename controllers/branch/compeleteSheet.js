const checkPreviousSheet = require("../../service/sheet/changeStatusCheck");
const updateOrCreateFieldsInDocument = require("../../service/utils/updateOrCreateFieldsInDocument");

const admin = require("../../config/firebase-admin");
const createSheetSummary = require("../../service/sheet/createSheetSummary");
const updateDashboardBranchInfoWhenNewSheetCreated = require("../../service/utils/updateBranchInfoWhenNewSheetCreated");
const getDocumentDataById = require("../../service/utils/getDocumentDataById");

/**
 * Creates a new sheet with multiple steps.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the sheet is successfully created.
 */
const ChangeSheetStatus = async (req, res) => {
  try {
    const data = req.body;

    // Check if data is null or undefined
    if (!data) {
      return res
        .status(400)
        .json({ message: "Request body is missing or empty." });
    }

    const db = admin.firestore();
    const batch = db.batch(); // Create a Firestore batch

    // Step 1: Check if there is a previous sheet
    const prevSheetCheckResult = await checkPreviousSheet(data.previousActive);
    if (prevSheetCheckResult) {
      return res.status(400).json(prevSheetCheckResult);
    }

    // Step 6: Update or create fields in the new sheet document within the batch
    await updateOrCreateFieldsInDocument(
      db,
      batch,
      "sheets",
      data.previousActive,
      { sheetStatus: "Completed" }
    );

    // Step 8: Update or create fields in the branches document within the batch
    await updateOrCreateFieldsInDocument(db, batch, "branches", data.branchId, {
      active: "",
      activeSheet: "",
      activeDailySummery: "",
      activeTable: "",
      sheetStatus: "Completed",
      PrevactiveSheet: data.previousActive,
    });

    const totalCredit = await getDocumentDataById("totalCredit", data.branchId);
    const currentStatus = await getDocumentDataById("Status", data.active);

    // Step 12: Update dashboard branch info within the batch
    await updateDashboardBranchInfoWhenNewSheetCreated(
      data.branchId,
      db,
      batch
    );

    // Step 13: Execute createSheetSummary function within the batch
    await createSheetSummary(currentStatus, totalCredit, db, batch);

    // Step 14: Commit the batch
    await batch.commit();

    // Step 15: Respond with success message
    res.status(200).json({
      message: `Sheet status successfully changed to Completed.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = ChangeSheetStatus;
