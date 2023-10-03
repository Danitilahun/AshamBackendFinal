const editDocument = require("../../../service/mainCRUD/editDoc");
const updateSalaryTable = require("../../../service/credit/updateSalaryTable/updateSalaryTable");
const updateSheetStatus = require("../../../service/credit/updateSheetStatus/updateSheetStatus");
const updateDashboard = require("../../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../../service/credit/dashboard/updateDashboardBranchInfo");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const admin = require("../../../config/firebase-admin"); // Import Firebase Admin
/**
 * Edit delivery guy data by processing a request.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} A JSON response indicating the result of the operation.
 */

const HandleStaffSalaryPayment = async (req, res) => {
  // Create Firestore database and batch
  const db = admin.firestore();
  const batch = db.batch();
  try {
    // Step 1: Extract delivery guy ID from the request parameters
    const { id } = req.params;
    const updatedData = req.body;
    console.log(updatedData);
    const branch = await getDocumentDataById("branches", updatedData.branchId);
    if (!branch.active) {
      return res.status(400).json({
        message:
          "You can't pay or unpay salary to a staff member. Since you do not have salaray table.",
      });
    }
    // Step 3: Edit the delivery guy document in the "deliveryguy" collection
    await editDocument(db, batch, "staff", id, updatedData);
    let salaryUpdate = {};
    if (updatedData.paid) {
      salaryUpdate = {
        fixedSalary: parseInt(updatedData.salary),
        total: parseInt(updatedData.salary),
      };
    } else {
      salaryUpdate = {
        fixedSalary: -parseInt(updatedData.salary),
        total: -parseInt(updatedData.salary),
      };
    }

    const newSalaryTable = await updateSalaryTable(
      `staffSalary`,
      updatedData.active,
      id,
      "total",
      salaryUpdate,
      db,
      batch
    );

    // Determine the SalaryType based on placement

    // Update sheet status with new SalaryType value
    const newStatus = await updateSheetStatus(
      updatedData.active,
      "totalStaffSalary",
      newSalaryTable.total.total + salaryUpdate.total,
      db,
      batch
    );

    // Update the dashboard with the new status
    await updateDashboard(
      db,
      batch,
      updatedData.branchId,
      newStatus.totalExpense
    );

    // Update dashboard branch info with the new status
    await updateDashboardBranchInfo(
      db,
      batch,
      updatedData.branchId,
      newStatus.totalExpense
    );

    // Commit the batch updates
    await batch.commit();

    res.status(200).json({ message: "Staff data edited successfully." });
  } catch (error) {
    // Step 7: Handle errors and send an error response
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = HandleStaffSalaryPayment;
