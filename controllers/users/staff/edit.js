const pushToFieldArray = require("../../../service/utils/pushToFieldArray");
const updateFieldsInNestedObject = require("../../../service/utils/updateFieldsInNestedObject");
const editDocument = require("../../../service/mainCRUD/editDoc");
const updateSalaryTable = require("../../../service/credit/updateSalaryTable/updateSalaryTable");
const updateSheetStatus = require("../../../service/credit/updateSheetStatus/updateSheetStatus");
const updateDashboard = require("../../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../../service/credit/dashboard/updateDashboardBranchInfo");
const admin = require("../../../config/firebase-admin"); // Import Firebase Admin

/**
 * Edit delivery guy data by processing a request.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} A JSON response indicating the result of the operation.
 */

const editStaff = async (req, res) => {
  // Create Firestore database and batch
  const db = admin.firestore();
  const batch = db.batch();

  try {
    // Step 1: Extract delivery guy ID from the request parameters
    const { id } = req.params;

    // Step 2: Extract relevant fields from the request body
    const { nameChange, salaryChange, difference, active, ...updatedData } =
      req.body;

    console.log(req.body);

    // Step 3: Edit the delivery guy document in the "deliveryguy" collection
    await editDocument(db, batch, "staff", id, updatedData);

    // Step 4: Update related data in the "tables" and "salary" collections

    if (active && nameChange) {
      await updateFieldsInNestedObject(db, batch, "staffSalary", active, id, {
        name: updatedData.fullName,
        uniqueName: updatedData.uniqueName,
        bankAccount: updatedData.bankAccount,
      });
    }

    if (active && salaryChange) {
      const salaryUpdate = {
        fixedSalary: parseInt(difference),
        total: parseInt(difference),
      };

      const newSalaryTable = await updateSalaryTable(
        "staffSalary",
        active,
        id,
        "total",
        salaryUpdate,
        db,
        batch
      );

      const newStatus = await updateSheetStatus(
        active,
        "totalStaffSalary",
        newSalaryTable.total.total + parseInt(difference),
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
    }

    // Step 5: Update the "worker" field array in the "branches" collection
    if (nameChange) {
      await pushToFieldArray(
        db,
        batch,
        "branches",
        updatedData.branchId,
        "worker",
        {
          id: id,
          name: updatedData.fullName,
          role: updatedData.role,
        }
      );
    }

    // Commit the batch updates
    await batch.commit();

    // Step 6: Send a success response
    res.status(200).json({ message: "Staff data edited successfully." });
  } catch (error) {
    // Step 7: Handle errors and send an error response
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = editStaff;
