const deleteDocument = require("../../service/mainCRUD/deleteDoc");
const deleteRelatedDocuments = require("../../service/sheet/deleteRelatedDocuments");
const updateBranchActiveSheet = require("../../service/sheet/updateBranchActiveSheet");
const getDocumentDataById = require("../../service/utils/getDocumentDataById");
const popArrayElement = require("../../service/utils/popArrayElementFromObject");
const updateDashboardBranchInfoWhenNewSheetCreated = require("../../service/utils/updateBranchInfoWhenNewSheetCreated");
const updateOrCreateFieldsInDocument = require("../../service/utils/updateOrCreateFieldsInDocument");
const admin = require("../../config/firebase-admin");
const popArrayElementAndUpdateFields = require("../../service/utils/popArrayElementAndUpdateFields");
/**
 * Delete a sheet and its related documents.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {object} db - The Firestore database instance.
 * @param {object} batch - The Firestore batch object.
 */

const deleteSheet = async (req, res) => {
  try {
    const db = admin.firestore();
    // Create a new batch
    const batch = db.batch();

    const { id } = req.params;
    console.log(id);
    // Step 1: Get the sheet data by ID
    const sheetData = await getDocumentDataById("sheets", id);
    console.log("sheetData", sheetData);
    // Step 2: Delete the sheet document using the batch
    await deleteDocument(db, batch, "sheets", id);

    // Step 3: Delete related documents (Status, Calculator, tables, staffSalary, etc.) using the batch
    await deleteRelatedDocuments(sheetData, db, batch);

    // Step 4: Update the activeSheet in the branches collection
    const branch = await getDocumentDataById("branches", sheetData.branchId);
    if (branch.activeSheet === id) {
      // console.log(manye);
      await popArrayElement(
        "salaryTable",
        { name: sheetData.name, id: sheetData.active },
        sheetData.branchId,
        "branches",
        db,
        batch,
        {
          activeSheet: "",
          activeTable: "",
          active: "",
          activeDailySummery: "",
          sheetStatus: "Completed",
        }
      );
      await updateDashboardBranchInfoWhenNewSheetCreated(
        sheetData.branchId,
        db,
        batch
      );
    } else {
      // Step 5: Remove the sheet from the salaryTable array in branches
      await popArrayElement(
        "salaryTable",
        { name: sheetData.name, id: sheetData.active },
        sheetData.branchId,
        "branches",
        db,
        batch,
        {}
      );
    }

    // console.log(manye);
    // Commit the batch to execute all delete operations
    await batch.commit();

    res.status(200).json({ message: "Sheet deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteSheet;
