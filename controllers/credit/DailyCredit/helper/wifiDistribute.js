const updateDashboard = require("../../../../service/report/updateDashBoard/WifiDistribute/updateDashboard");
const updateDashboardBranchInfo = require("../../../../service/report/updateDashBoard/WifiDistribute/updateDashboardBranchInfo");
const getSingleDocFromCollection = require("../../../../service/utils/getSingleDocFromCollection");
const updateCalculatorAmount = require("../../../../service/utils/updateCalculatorAmount");
const updateSheetStatus = require("../../../../service/utils/updateSheetStatus");
const updateTable = require("../../../../service/utils/updateTable");

// const wifiDistribute = async (data) => {
//   try {
//     // Updating various tables with wifiDistribute information
//     const DeliveryGuyGain = await getSingleDocFromCollection("prices");
//     const companyGain = await getSingleDocFromCollection("companyGain");

//     // First update: Change the daily table
//     await updateTable("tables", data.activeTable, data.deliveryguyId, "total", {
//       wifiDistribute: data.numberOfCard,
//       total: data.numberOfCard * companyGain.wifi_distribute_gain,
//     });

//     // Second update: Change the 15 days summary and daily summary tables
//     await updateTable("tables", data.activeDailySummery, data.date, "total", {
//       wifiDistribute: data.numberOfCard,
//       total: data.numberOfCard * companyGain.wifi_distribute_gain,
//     });

//     // Third update: Individual person's daily work summary
//     const newIncome = await updateTable(
//       "tables",
//       data.active,
//       data.deliveryguyId,
//       "total",
//       {
//         wifiDistribute: data.numberOfCard,
//         total: data.numberOfCard * companyGain.wifi_distribute_gain,
//       }
//     );

//     const newStatus = await updateSheetStatus(
//       db,
//       batch,
//       data.active,
//       "totalIncome",
//       newIncome.total.total
//     );
//     // Updating dashboard with newIncome and newSalaryExpense details
//     await updateDashboard(
//       data.branchId,
//       newIncome.total.total,
//       newStatus.totalExpense,
//       data.numberOfCard * companyGain.wifi_distribute_gain
//     );

//     // Updating dashboard branch information
//     await updateDashboardBranchInfo(
//       data.branchId,
//       newIncome.total.total,
//       newStatus.totalExpense,
//       newIncome.total.wifiDistribute
//     );

//     await updateCalculatorAmount(data.active, newIncome.total.total);

//     console.log("Updates completed successfully.");
//   } catch (error) {
//     console.error("Error in wifiDistribute:", error);
//   }
// };

// module.exports = wifiDistribute;

const wifiDistribute = async (data, db, batch) => {
  try {
    // Updating various tables with wifiDistribute information

    const companyGain = await getSingleDocFromCollection("companyGain");

    // First update: Change the daily table
    await updateTable(
      db,
      "tables",
      data.activeTable,
      data.deliveryguyId,
      "total",
      {
        wifiDistribute: data.numberOfCard,
        total: data.numberOfCard * companyGain.wifi_distribute_gain,
      },
      batch
    );

    // Second update: Change the 15 days summary and daily summary tables
    await updateTable(
      db,
      "tables",
      data.activeDailySummery,
      data.date,
      "total",
      {
        wifiDistribute: data.numberOfCard,
        total: data.numberOfCard * companyGain.wifi_distribute_gain,
      },
      batch
    );

    // Third update: Individual person's daily work summary
    const newIncome = await updateTable(
      db,
      "tables",
      data.active,
      data.deliveryguyId,
      "total",
      {
        wifiDistribute: data.numberOfCard,
        total: data.numberOfCard * companyGain.wifi_distribute_gain,
      },
      batch
    );

    const newStatus = await updateSheetStatus(
      db,
      batch,
      data.active,
      "totalIncome",
      newIncome.total.total +
        data.numberOfCard * companyGain.wifi_distribute_gain
    );
    // Updating dashboard with newIncome and newSalaryExpense details
    await updateDashboard(
      db,
      batch,
      data.branchId,
      newStatus.totalIncome,
      newStatus.totalExpense,
      data.numberOfCard * companyGain.wifi_distribute_gain
    );

    // Updating dashboard branch information
    await updateDashboardBranchInfo(
      db,
      batch,
      data.branchId,
      newStatus.totalIncome,
      newStatus.totalExpense,
      newIncome.total.wifiDistribute + data.numberOfCard
    );

    await updateCalculatorAmount(db, batch, data.active, newStatus.totalIncome);

    console.log("Updates completed successfully.");
  } catch (error) {
    console.error("Error in wifiDistribute:", error);
  }
};

module.exports = wifiDistribute;
