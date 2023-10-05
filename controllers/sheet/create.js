const createDocument = require("../../service/mainCRUD/createDoc");
const checkPreviousSheet = require("../../service/sheet/checkPreviousSheet");
const createCalculator = require("../../service/sheet/createCalculator");
const createDailySummerySheet = require("../../service/sheet/createDailySummerySheet");
const createDeliveryGuySalaryTable = require("../../service/sheet/createDeliveryGuySalaryTable");
const createIndividualDeliveryGuy15DayWorkSummery = require("../../service/sheet/createIndividualDeliveryGuy15DayWorkSummery");
const createSheetSummary = require("../../service/sheet/createSheetSummary");
const createStaffSalaryTable = require("../../service/sheet/createStaffSalaryTable");
const createStatusCollection = require("../../service/sheet/createStatusCollection");
const getDocumentDataById = require("../../service/utils/getDocumentDataById");
const pushToFieldArray = require("../../service/utils/salaryTableArray");
const updateDashboardBranchInfoWhenNewSheetCreated = require("../../service/utils/updateBranchInfoWhenNewSheetCreated");
const updateOrCreateFieldsInDocument = require("../../service/utils/updateOrCreateFieldsInDocument");
const generateCustomID = require("../../util/generateCustomID");

const admin = require("../../config/firebase-admin");
const pushToFieldArrayAndUpdateFields = require("../../service/utils/pushToFieldArrayAndUpdateFields");

/**
 * Creates a new sheet with multiple steps.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the sheet is successfully created.
 */
const createSheet = async (req, res) => {
  try {
    const data = req.body;

    if (!data) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }
    // Step 1: Check if there is a previous sheet

    const prevSheetCheckResult = await checkPreviousSheet(data.previousActive);
    if (prevSheetCheckResult) {
      return res.status(400).json(prevSheetCheckResult);
    }

    const prevSheet = await getDocumentDataById("branches", data.branchId);
    if (prevSheet && prevSheet.sheetStatus === "Pending") {
      return res.status(400).json({
        message:
          "Unable to create a new sheet. Please complete the pending sheet before creating a new one. If you've already completed it, please notify the finance department for further assistance.",
        type: "info",
      });
    }

    // Create Firestore database instance
    const db = admin.firestore();

    // Create a new batch
    const batch = db.batch();

    // Step 2: Get current status and total credit data
    const totalCredit = await getDocumentDataById("totalCredit", data.branchId);
    if (!totalCredit) {
      return res.status(500).json({
        message: "Branch total credit is missing.",
        type: "error",
      });
    }
    // Step 4: Create a new sheet document
    data.tablecount = 0;
    data.tableDate = [];
    const newDocId = await createDocument("sheets", data, db, batch);
    const customId1 = generateCustomID(`${newDocId}-${data.branchId}`);
    const customId2 = generateCustomID(
      `${newDocId}-${data.branchId}-${"16day"}`
    );
    // Step 5: Create status collection

    if (!newDocId || !data.date || !data.branchId) {
      return res.status(500).json({
        message:
          "Fail to create sheet.Something is missing.Please refresh your browser and try again.",
        type: "error",
      });
    }
    // Step 6: Update or create fields in the new sheet document
    await updateOrCreateFieldsInDocument(db, batch, "sheets", newDocId, {
      active: customId1,
      activeDailySummery: customId2,
      sheetStatus: "Pending",
    });

    // Step 7: Push data to the "salaryTable" field array
    await pushToFieldArrayAndUpdateFields(
      "branches",
      data.branchId,
      "salaryTable",
      {
        name: data.name,
        id: customId1,
      },
      db,
      batch,
      {
        active: customId1,
        activeSheet: newDocId,
        activeDailySummery: customId2,
        activeTable: "",
        sheetStatus: "Pending",
      }
    );

    // Step 8: Update or create fields in the branches document
    // await updateOrCreateFieldsInDocument(db, batch, "branches", data.branchId, );

    // Step 9: Create individual delivery guy 15-day work summary
    await createIndividualDeliveryGuy15DayWorkSummery(
      newDocId,
      data.branchId,
      customId1,
      db,
      batch
    );

    // Step 10: Create daily summary sheet
    await createDailySummerySheet(
      newDocId,
      data.branchId,
      customId2,
      db,
      batch
    );

    // Step 11: Create calculator
    await createCalculator(
      customId1,
      newDocId,
      data.branchId,
      totalCredit,
      db,
      batch
    );

    // Step 12: Create delivery guy salary table
    await createDeliveryGuySalaryTable(
      customId1,
      newDocId,
      data.branchId,
      db,
      batch
    );

    // Step 13: Create staff salary table
    const totalStaffSalary = await createStaffSalaryTable(
      customId1,
      newDocId,
      data.branchId,
      db,
      batch
    );

    const branch = await getDocumentDataById("branches", data.branchId);

    if (totalStaffSalary || totalStaffSalary === 0) {
      branch.totalStaffSalary = totalStaffSalary;
      await createStatusCollection(
        customId1,
        data.date,
        branch,
        data.branchId,
        db,
        batch
      );
    }

    // console.log(manye);
    // Commit the batch
    await batch.commit();

    // Step 14: Respond with success message
    res.status(200).json({
      message: `Sheet successfully created.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = createSheet;
