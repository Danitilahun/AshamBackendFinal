// updateBranchActiveSheet.js

const getDocumentDataById = require("../utils/getDocumentDataById");
const updateDashboardBranchInfoWhenNewSheetCreated = require("../utils/updateBranchInfoWhenNewSheetCreated");
const updateOrCreateFieldsInDocument = require("../utils/updateOrCreateFieldsInDocument");

const updateBranchActiveSheet = async (sheetData, id) => {
  try {
    const { branchId } = sheetData;
    const branch = await getDocumentDataById("branches", branchId);
    if (branch.activeSheet === id) {
      await updateOrCreateFieldsInDocument("branches", branchId, {
        activeSheet: "",
        activeTable: "",
        active: "",
        activeDailySummery: "",
      });
      await updateDashboardBranchInfoWhenNewSheetCreated(branchId);
    }
  } catch (error) {
    console.error("Error updating activeSheet in branches:", error);
    throw error;
  }
};

module.exports = updateBranchActiveSheet;
