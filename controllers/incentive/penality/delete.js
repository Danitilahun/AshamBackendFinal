const updateDashboard = require("../../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../../service/credit/dashboard/updateDashboardBranchInfo");
const updateSalaryTable = require("../../../service/credit/updateSalaryTable/updateSalaryTable");
const updateSheetStatus = require("../../../service/credit/updateSheetStatus/updateSheetStatus");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");

// module.exports = deletePenality;
const admin = require("../../../config/firebase-admin");

/**
 * Delete a penality document and perform related operations.
 *
 * @param {Object} req - Express.js request object.
 * @param {Object} res - Express.js response object.
 * @returns {Object} JSON response indicating success or failure.
 */

const deletePenality = async (req, res) => {
  try {
    const penalityId = req.params.penalityId;

    if (!penalityId) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }
    // Create Firestore database instance
    const db = admin.firestore();
    const batch = db.batch();

    // Retrieve the penality data before deleting for updating total credit
    const penalityData = await getDocumentDataById("Penality", penalityId, db);

    // Delete the penality document in the "Penality" collection
    const penalityDocRef = db.collection("Penality").doc(penalityId);
    batch.delete(penalityDocRef);

    const salaryUpdate = {
      penality: -parseInt(penalityData.amount),
      total: parseInt(penalityData.amount),
    };
    const collectionName =
      penalityData.placement === "DeliveryGuy" ? "salary" : "staffSalary";
    const newSalary = await updateSalaryTable(
      collectionName,
      penalityData.active,
      penalityData.employeeId,
      "total",
      salaryUpdate,
      db,
      batch
    );

    // Determine the SalaryType based on placement
    const SalaryType =
      penalityData.placement === "DeliveryGuy"
        ? "totalDeliveryGuySalary"
        : "totalStaffSalary";

    if (newSalary) {
      // Update sheet status with new SalaryType value
      const newStatus = await updateSheetStatus(
        penalityData.active,
        SalaryType,
        newSalary.total.total + parseInt(penalityData.amount),
        db,
        batch
      );

      if (newStatus) {
        // Update the dashboard with the new status
        await updateDashboard(
          db,
          batch,
          penalityData.branchId,
          newStatus.totalExpense
        );

        // Update dashboard branch info with the new status
        await updateDashboardBranchInfo(
          db,
          batch,
          penalityData.branchId,
          newStatus.totalExpense
        );
      }
    }

    // Commit the batch
    await batch.commit();

    // Respond with a success message
    res.status(200).json({ message: `Penality Deleted successfully.` });
  } catch (error) {
    console.error(error);
    // Respond with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = deletePenality;
