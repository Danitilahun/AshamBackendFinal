const admin = require("../../../../../config/firebase-admin"); // Import Firebase Admin
const updateDashboard = require("../../../../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../../../../service/credit/dashboard/updateDashboardBranchInfo");
const updateSalaryTable = require("../../../../../service/credit/updateSalaryTable/updateSalaryTable");
const updateSheetStatus = require("../../../../../service/utils/updateSheetStatus");

/**
 * Creates a new credit document, updates the total credit, and performs related calculations.
 * @param {Object} req - Express.js request object containing the credit data in the body.
 * @param {Object} res - Express.js response object.
 * @throws {Error} Throws an error if any operation fails.
 *
 * @example
 * app.post('/', createCredit);
 */
const BonusToIndividualStaff = async (req, res) => {
  const db = admin.firestore(); // Get Firestore instance
  const batch = db.batch(); // Create a Firestore batch

  try {
    const data = req.body;
    console.log(data);

    const salaryUpdate = {
      holidayBonus: parseInt(data.holidayBonus),
      total: parseInt(data.holidayBonus),
    };
    const newSalaryTable = await updateSalaryTable(
      "staffSalary",
      data.salaryTableId,
      data.employeeId,
      "total",
      salaryUpdate,
      db,
      batch // Pass the db and batch instances
    );

    if (newSalaryTable) {
      // Update sheet status with new SalaryType value
      const newStatus = await updateSheetStatus(
        db,
        batch,
        data.salaryTableId,
        "totalStaffSalary",
        newSalaryTable.total.total + parseInt(data.holidayBonus)
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
    res.status(200).json({ message: `Bonus Created successfully.` });
  } catch (error) {
    console.error(error);
    // Respond with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = BonusToIndividualStaff;
