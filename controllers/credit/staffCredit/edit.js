const updateDashboard = require("../../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../../service/credit/dashboard/updateDashboardBranchInfo");
const updateSheetStatus = require("../../../service/credit/updateSheetStatus/updateSheetStatus");
const admin = require("../../../config/firebase-admin");
const handleEmployeeChange = require("../../../service/credit/handleEmployeeChange/handleEmployeeChange");
const updateSalaryTable = require("../../../service/credit/updateSalaryTable/updateSalaryTable");
const editDocument = require("../../../service/mainCRUD/editDoc");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const updateCalculator = require("../../../service/credit/updateCalculator/updateCalculator");
const updateCreditDocument = require("../../../service/credit/totalCredit/updateCreditDocument");
/**
 * Edit a credit document and perform related operations.
 *
 * @param {Object} req - Express.js request object containing the updated credit data in the body.
 * @param {Object} res - Express.js response object.
 * @returns {Object} JSON response indicating success or failure.
 */

const editCredit = async (req, res) => {
  try {
    const creditId = req.params.creditId;
    const { employessChange, ...updatedData } = req.body;
    const newValue = updatedData.difference;
    delete updatedData.difference;

    if (
      !updatedData ||
      !creditId ||
      !updatedData.branchId ||
      !updatedData.active
    ) {
      return res
        .status(400)
        .json({ message: "Request body is missing or empty." });
    }

    const db = admin.firestore();
    const batch = db.batch();

    if (employessChange) {
      const result = await handleEmployeeChange(
        updatedData,
        creditId,
        db,
        batch
      );
      if (!result) {
        return res.status(400).json({
          type: "info",
          message: `This ${updatedData.placement} do not have enough balance to take credit.`,
        });
      }
    }
    // Check if the employee has enough balance for the credit
    const SalaryData = await getDocumentDataById(
      updatedData.placement === "DeliveryGuy" ? "salary" : "staffSalary",
      updatedData.active
    );

    const employeeBalance = SalaryData[updatedData.employeeId]["total"];
    if (parseInt(employeeBalance) < parseInt(updatedData.amount)) {
      // Return an informational response if the balance is insufficient
      return res.status(400).json({
        type: "info",
        message: `This ${updatedData.placement} do not have enough balance to take credit.`,
      });
    }

    // Edit the existing credit document in the "CustomerCredit" collection
    await editDocument(db, batch, "StaffCredit", creditId, updatedData);

    const salaryUpdate = {
      totalCredit: parseInt(newValue),
    };

    const collectionName =
      updatedData.placement === "DeliveryGuy" ? "salary" : "staffSalary";

    await updateSalaryTable(
      collectionName,
      updatedData.active,
      updatedData.employeeId,
      "total",
      salaryUpdate,
      db,
      batch
    );

    const newTotalCredit = await updateCreditDocument(
      updatedData.branchId,
      "StaffCredit",
      parseFloat(newValue ? newValue : 0),
      db,
      batch
    );

    if (newTotalCredit) {
      // Update the calculator with the new total credit within the batch
      await updateCalculator(
        updatedData.active,
        parseFloat(newTotalCredit.total ? newTotalCredit.total : 0),
        db,
        batch
      );
    }
    await batch.commit();
    // Respond with a success message
    res.status(200).json({ message: `StaffCredit Edited successfully.` });
  } catch (error) {
    console.error(error);

    // Respond with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = editCredit;
