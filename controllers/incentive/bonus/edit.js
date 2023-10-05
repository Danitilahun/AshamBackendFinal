const updateDashboard = require("../../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../../service/credit/dashboard/updateDashboardBranchInfo");
const updateSalaryTable = require("../../../service/credit/updateSalaryTable/updateSalaryTable");
const updateSheetStatus = require("../../../service/credit/updateSheetStatus/updateSheetStatus");
const handleEmployeeBonusChange = require("../../../service/incentive/bonus/handleEmployeeChange");
const admin = require("../../../config/firebase-admin");

/**
 * Edit a credit document and perform related operations.
 *
 * @param {Object} req - Express.js request object containing the updated credit data in the body.
 * @param {Object} res - Express.js response object.
 * @returns {Object} JSON response indicating success or failure.
 */
const editBonus = async (req, res) => {
  try {
    const bonusId = req.params.bonusId;
    const { difference, employeeChange, ...updatedData } = req.body;
    const newValue = difference;
    console.log(updatedData);

    if (!updatedData || !bonusId) {
      return res
        .status(400)
        .json({
          message:
            "Request body is missing or empty.Please refresh your browser and try again.",
        });
    }
    // Create Firestore database instance
    const db = admin.firestore();
    // Create Firestore batch
    const batch = db.batch();

    // Edit the existing credit document in the "CustomerCredit" collection
    const bonusDocRef = db.collection("Bonus").doc(bonusId);
    batch.update(bonusDocRef, updatedData);

    const salaryUpdate = {
      bonus: parseInt(newValue),
      total: parseInt(newValue),
    };

    const collectionName =
      updatedData.placement === "DeliveryGuy" ? "salary" : "staffSalary";

    const newSalaryTable = await updateSalaryTable(
      collectionName,
      updatedData.active,
      updatedData.employeeId,
      "total",
      salaryUpdate,
      db,
      batch
    );

    // Determine the SalaryType based on placement
    const SalaryType =
      updatedData.placement === "DeliveryGuy"
        ? "totalDeliveryGuySalary"
        : "totalStaffSalary";

    if (newSalaryTable) {
      // Update sheet status with new SalaryType value
      const newStatus = await updateSheetStatus(
        updatedData.active,
        SalaryType,
        newSalaryTable.total.total + parseInt(newValue),
        db,
        batch
      );

      if (newStatus) {
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
    }

    // Commit the batch
    await batch.commit();

    // Respond with a success message
    res.status(200).json({ message: `Bonus Edited successfully.` });
  } catch (error) {
    console.error(error);

    // Respond with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = editBonus;
