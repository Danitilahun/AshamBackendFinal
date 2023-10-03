const admin = require("../../../../../config/firebase-admin");
const updateDashboard = require("../../../../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../../../../service/credit/dashboard/updateDashboardBranchInfo");
const addHolidayForDeliveryGuy = require("../../../../../service/incentive/bonus/addHolidayForDeliveryGuy");
const updateSheetStatus = require("../../../../../service/utils/updateSheetStatus");

/**
 * Creates a new credit document, updates the total credit, and performs related calculations.
 *
 * @param {Object} req - Express.js request object containing the credit data in the body.
 * @param {Object} res - Express.js response object.
 * @throws {Error} Throws an error if any operation fails.
 * @example
 * app.post('/', createCredit);
 */
const DeliveryGuyHolidayBonus = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    // Create Firestore database instance and batch
    const db = admin.firestore();
    const batch = db.batch();

    const newSalaryTable = await addHolidayForDeliveryGuy(
      data.salaryTableId,
      data.holidayBonus,
      db,
      batch
    );

    console.log(newSalaryTable);
    if (newSalaryTable) {
      // Update sheet status with new SalaryType value
      const newStatus = await updateSheetStatus(
        db,
        batch,
        data.salaryTableId,
        "totalDeliveryGuySalary",
        newSalaryTable.total.total
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

module.exports = DeliveryGuyHolidayBonus;
