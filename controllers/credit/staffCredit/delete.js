const admin = require("../../../config/firebase-admin");
const updateDashboard = require("../../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../../service/credit/dashboard/updateDashboardBranchInfo");
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
    const db = admin.firestore();
    const batch = db.batch();
    // Retrieve the credit data before deleting for updating total credit
    const creditData = await getDocumentDataById("StaffCredit", creditId);

    // Delete the credit document in the "CustomerCredit" collection
    await deleteDocument(db, batch, "StaffCredit", creditId);

    const salaryUpdate = {
      totalCredit: -parseInt(creditData.amount),
      total: parseInt(creditData.amount),
    };
    const collectionName =
      creditData.placement === "DeliveryGuy" ? "salary" : "staffSalary";
    const newSalaryTable = await updateSalaryTable(
      collectionName,
      creditData.active,
      creditData.employeeId,
      "total",
      salaryUpdate,
      db,
      batch
    );

    // Determine the SalaryType based on placement
    const SalaryType =
      creditData.placement === "DeliveryGuy"
        ? "totalDeliveryGuySalary"
        : "totalStaffSalary";

    // Update sheet status with new SalaryType value
    const newStatus = await updateSheetStatus(
      creditData.active,
      SalaryType,
      newSalaryTable.total.total + parseInt(creditData.amount),
      db,
      batch
    );

    // Update the dashboard with the new status
    await updateDashboard(
      db,
      batch,
      creditData.branchId,
      newStatus.totalExpense
    );

    // Update dashboard branch info with the new status
    await updateDashboardBranchInfo(
      db,
      batch,
      creditData.branchId,
      newStatus.totalExpense
    );

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
