const admin = require("../../../config/firebase-admin");
const updateDashboard = require("../../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../../service/credit/dashboard/updateDashboardBranchInfo");
const updateCreditDocument = require("../../../service/credit/totalCredit/updateCreditDocument");
const updateCalculator = require("../../../service/credit/updateCalculator/updateCalculator");
const updateSalaryTable = require("../../../service/credit/updateSalaryTable/updateSalaryTable");
const updateSheetStatus = require("../../../service/credit/updateSheetStatus/updateSheetStatus");
const deleteDocument = require("../../../service/mainCRUD/deleteDoc");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");

/**
 * Delete a credit document and perform related operations.
 *
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 * @returns {Object} JSON response indicating success or failure.
 */

const deleteCredit = async (req, res) => {
  try {
    const creditId = req.params.creditId;
    if (!creditId) {
      return res.status(400).json({
        message:
          "Required req body is missing.Please refresh your browser and try again.",
      });
    }
    const db = admin.firestore();
    const batch = db.batch();
    // Retrieve the credit data before deleting for updating total credit
    const creditData = await getDocumentDataById("StaffCredit", creditId);
    if (!creditData) {
      return res.status(404).json({ message: "Credit document not found." });
    }
    // Delete the credit document in the "CustomerCredit" collection
    await deleteDocument(db, batch, "StaffCredit", creditId);

    const salaryUpdate = {
      totalCredit: -parseInt(creditData.amount),
    };
    const collectionName =
      creditData.placement === "DeliveryGuy" ? "salary" : "staffSalary";

    await updateSalaryTable(
      collectionName,
      creditData.active,
      creditData.employeeId,
      "total",
      salaryUpdate,
      db,
      batch
    );

    // Update the total credit by subtracting the deleted credit amount
    const updatedTotalCredit = await updateCreditDocument(
      creditData.branchId,
      "StaffCredit",
      -parseFloat(creditData ? creditData.amount : 0), // Subtract the deleted credit amount
      db,
      batch
    );

    // Update the calculator with the new total credit
    if (updatedTotalCredit) {
      await updateCalculator(
        creditData.active,
        parseFloat(updatedTotalCredit.total ? updatedTotalCredit.total : 0),
        db,
        batch
      );
    }

    await batch.commit();
    // Respond with a success message
    res.status(200).json({ message: `StaffCredit Deleted successfully.` });
  } catch (error) {
    console.error(error);

    // Respond with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteCredit;
