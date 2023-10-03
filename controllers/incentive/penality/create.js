const updateDashboard = require("../../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../../service/credit/dashboard/updateDashboardBranchInfo");
const updateSalaryTable = require("../../../service/credit/updateSalaryTable/updateSalaryTable");
const updateSheetStatus = require("../../../service/credit/updateSheetStatus/updateSheetStatus");
const createDocument = require("../../../service/mainCRUD/createDoc");

const admin = require("../../../config/firebase-admin");

/**
 * Creates a new penality document, updates the total penality, and performs related calculations.
 *
 * @param {Object} req - Express.js request object containing the penality data in the body.
 * @param {Object} res - Express.js response object.
 * @throws {Error} Throws an error if any operation fails.
 */
const createPenality = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    // Create Firestore database instance
    const db = admin.firestore();
    // Create Firestore batch
    const batch = db.batch();

    // Determine the collection name based on the placement
    const collectionName =
      data.placement === "DeliveryGuy" ? "salary" : "staffSalary";

    // Create a new penality document in the "Penality" collection
    await createDocument("Penality", data, db, batch);

    // Update Salary table
    const salaryUpdate = {
      penality: parseInt(data.amount),
      total: -parseInt(data.amount),
    };
    const newSalaryTable = await updateSalaryTable(
      collectionName,
      data.active,
      data.employeeId,
      "total",
      salaryUpdate,
      db,
      batch
    );

    // Determine the SalaryType based on placement
    const SalaryType =
      data.placement === "DeliveryGuy"
        ? "totalDeliveryGuySalary"
        : "totalStaffSalary";

    if (newSalaryTable) {
      // Update sheet status with new SalaryType value
      const newStatus = await updateSheetStatus(
        data.active,
        SalaryType,
        newSalaryTable.total.total - parseInt(data.amount),
        db,
        batch
      );
      if (newStatus) {
        // Update the dashboard with the new status
        await updateDashboard(db, batch, data.branchId, newStatus.totalExpense);

        // Update dashboard branch info with the new status
        await updateDashboardBranchInfo(
          db,
          batch,
          data.branchId,
          newStatus.totalExpense
        );
      }
    }

    // Commit the batch
    await batch.commit();

    // Respond with a success message
    res.status(200).json({ message: `Penality Created successfully.` });
  } catch (error) {
    console.error(error);

    // Respond with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = createPenality;
