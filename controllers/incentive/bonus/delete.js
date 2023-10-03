const updateDashboard = require("../../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../../service/credit/dashboard/updateDashboardBranchInfo");
const updateSalaryTable = require("../../../service/credit/updateSalaryTable/updateSalaryTable");
const updateSheetStatus = require("../../../service/credit/updateSheetStatus/updateSheetStatus");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const admin = require("../../../config/firebase-admin");

/**
 * Delete a credit document and perform related operations.
 *
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 * @returns {Object} JSON response indicating success or failure.
 */

const deleteBonus = async (req, res) => {
  try {
    const bonusId = req.params.bonusId;

    // Create Firestore database instance
    const db = admin.firestore();
    // Create Firestore batch
    const batch = db.batch();

    // Retrieve the credit data before deleting for updating total credit
    const bonusData = await getDocumentDataById("Bonus", bonusId);

    // Delete the credit document in the "CustomerCredit" collection
    const bonusDocRef = db.collection("Bonus").doc(bonusId);
    batch.delete(bonusDocRef);

    const salaryUpdate = {
      bonus: -parseInt(bonusData.amount),
      total: -parseInt(bonusData.amount),
    };
    const collectionName =
      bonusData.placement === "DeliveryGuy" ? "salary" : "staffSalary";
    const newSalaryTable = await updateSalaryTable(
      collectionName,
      bonusData.active,
      bonusData.employeeId,
      "total",
      salaryUpdate,
      db,
      batch
    );

    // Determine the SalaryType based on placement
    const SalaryType =
      bonusData.placement === "DeliveryGuy"
        ? "totalDeliveryGuySalary"
        : "totalStaffSalary";

    if (newSalaryTable) {
      // Update sheet status with new SalaryType value
      const newStatus = await updateSheetStatus(
        bonusData.active,
        SalaryType,
        newSalaryTable.total.total - parseInt(bonusData.amount),
        db,
        batch
      );

      if (newStatus) {
        // Update the dashboard with the new status
        await updateDashboard(
          db,
          batch,
          bonusData.branchId,
          newStatus.totalExpense
        );

        // Update dashboard branch info with the new status
        await updateDashboardBranchInfo(
          db,
          batch,
          bonusData.branchId,
          newStatus.totalExpense
        );
      }
    }

    // Commit the batch
    await batch.commit();

    // Respond with a success message
    res.status(200).json({ message: `Bonus Deleted successfully.` });
  } catch (error) {
    console.error(error);

    // Respond with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteBonus;

module.exports = deleteBonus;
