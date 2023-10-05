const updateDashboard = require("../../../service/credit/dashboard/updateDashboard");
const updateSalaryTable = require("../../../service/credit/updateSalaryTable/updateSalaryTable");
const updateSheetStatus = require("../../../service/credit/updateSheetStatus/updateSheetStatus");
const createDocument = require("../../../service/mainCRUD/createDoc");
const admin = require("../../../config/firebase-admin"); // Import Firebase Admin
const updateDashboardBranchInfo = require("../../../service/credit/dashboard/updateDashboardBranchInfoExpense");

/**
 * Creates a new credit document, updates the total credit, and performs related calculations.
 *
 * @param {Object} req - Express.js request object containing the credit data in the body.
 * @param {Object} res - Express.js response object.
 * @throws {Error} Throws an error if any operation fails.
 *
 * @example
 * app.post('/', createCredit);
 */
const createBonus = async (req, res) => {
  const db = admin.firestore(); // Create Firestore instance
  const batch = db.batch(); // Create Firestore batch

  try {
    const data = req.body;
    console.log(data);
    if (!data) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }

    // Determine the collection name based on the placement
    const collectionName =
      data.placement === "DeliveryGuy" ? "salary" : "staffSalary";

    // Create a new credit document in the "StaffCredit" collection using the batch
    await createDocument("Bonus", data, db, batch);

    // Update Salary table
    const salaryUpdate = {
      bonus: parseInt(data.amount),
      total: parseInt(data.amount),
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

    if (!newSalaryTable) {
      throw new Error(
        "unable to update salary table.Please refresh your browser and try again."
      );
    }
    // Determine the SalaryType based on placement
    const SalaryType =
      data.placement === "DeliveryGuy"
        ? "totalDeliveryGuySalary"
        : "totalStaffSalary";

    // Update sheet status with new SalaryType value
    const newStatus = await updateSheetStatus(
      data.active,
      SalaryType,
      newSalaryTable.total.total + parseInt(data.amount),
      db,
      batch
    );
    if (newStatus) {
      // Update the dashboard with the new status
      await updateDashboard(db, batch, data.branchId, newStatus.totalExpense);

      // Update dashboard branch info with the new status
      await updateDashboardBranchInfo(
        data.branchId,
        newStatus.totalExpense,
        db,
        batch
      );
    }
    // Commit the batch to perform all operations atomically
    await batch.commit();

    // Respond with a success message
    res.status(200).json({ message: `Bonus Created successfully.` });
  } catch (error) {
    console.error(error);
    // Respond with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = createBonus;
