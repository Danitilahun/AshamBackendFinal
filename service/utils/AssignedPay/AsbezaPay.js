const updateDashboard = require("../../credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../credit/dashboard/updateDashboardBranchInfo");
const getSingleDocFromCollection = require("./../getSingleDocFromCollection");
const updateSheetStatus = require("./../updateSheetStatus");
const updateTable = require("./../updateTable");

const payAsbezaDeliveryGuy = async (db, data, batch, AsbezaCount) => {
  try {
    // Getting cardFee information from the prices collection
    const DeliveryGuyGain = await getSingleDocFromCollection("prices");

    if (!DeliveryGuyGain) {
      return {
        success: false,
        message:
          "Prices information is missing. Please refresh your browser and try again.",
      };
    }

    // Fourth update: Salary of the delivery guy table
    const newSalaryExpense = await updateTable(
      db,
      "salary",
      data.active,
      data.deliveryguyId,
      "total",
      {
        asbezaNumber: parseInt(AsbezaCount) * DeliveryGuyGain.asbezaPrice,
        total: parseInt(AsbezaCount) * DeliveryGuyGain.asbezaPrice,
      },
      batch
    );

    if (newSalaryExpense) {
      // Updating sheet status with totalDeliveryGuySalary
      const newStatus = await updateSheetStatus(
        db,
        batch,
        data.active,
        "totalDeliveryGuySalary",
        newSalaryExpense.total.total + DeliveryGuyGain.asbezaPrice
      );

      if (newStatus) {
        // Update the dashboard with the new status
        await updateDashboard(
          db,
          batch,
          data.branchKey,
          newStatus.totalExpense ? newStatus.totalExpense : 0
        );

        // Update dashboard branch info with the new status
        await updateDashboardBranchInfo(
          db,
          batch,
          data.branchKey,
          newStatus.totalExpense ? newStatus.totalExpense : 0
        );
      }
    }

    return null;
  } catch (error) {
    throw error; // Re-throw the error to handle it at the caller's level
  }
};

module.exports = payAsbezaDeliveryGuy;
