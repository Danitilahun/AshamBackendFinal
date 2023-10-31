const updateDashboard = require("../credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../credit/dashboard/updateDashboardBranchInfo");
const getSingleDocFromCollection = require("./getSingleDocFromCollection");
const updateSheetStatus = require("./updateSheetStatus");
const updateTable = require("./updateTable");

const payDeliveryGuy = async (
  db,
  data,
  batch,
  AsbezaCount,
  CardCount,
  WifiCount,
  WaterCount
) => {
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

    const total =
      parseInt(WifiCount) * DeliveryGuyGain.wifi_collect_price +
      parseInt(WaterCount) * DeliveryGuyGain.water_collect_price +
      parseInt(CardCount) * DeliveryGuyGain.card_collect_price +
      parseInt(AsbezaCount) * DeliveryGuyGain.asbezaPrice;

    // Fourth update: Salary of the delivery guy table
    const newSalaryExpense = await updateTable(
      db,
      "salary",
      data.active,
      data.deliveryguyId,
      "total",
      {
        wifiCollect: parseInt(WifiCount) * DeliveryGuyGain.wifi_collect_price,
        waterCollect:
          parseInt(WaterCount) * DeliveryGuyGain.water_collect_price,
        cardCollect: parseInt(CardCount) * DeliveryGuyGain.card_collect_price,
        asbezaNumber: parseInt(AsbezaCount) * DeliveryGuyGain.asbezaPrice,
        total: total,
      },
      batch
    );

    // if (newSalaryExpense) {
    // // Updating sheet status with totalDeliveryGuySalary
    // const newStatus = await updateSheetStatus(
    //   db,
    //   batch,
    //   data.active,
    //   "totalDeliveryGuySalary",
    //   newSalaryExpense.total.total + total
    // );

    // if (newStatus) {
    //   // Update the dashboard with the new status
    //   await updateDashboard(
    //     db,
    //     batch,
    //     data.branchId,
    //     newStatus.totalExpense ? newStatus.totalExpense : 0
    //   );

    //   // Update dashboard branch info with the new status
    //   await updateDashboardBranchInfo(
    //     db,
    //     batch,
    //     data.branchId,
    //     newStatus.totalExpense ? newStatus.totalExpense : 0
    //   );
    // }
    // }

    return [total, newSalaryExpense.total.total];
  } catch (error) {
    throw error; // Re-throw the error to handle it at the caller's level
  }
};

module.exports = payDeliveryGuy;
