// const updateDashboard = require("../../../../service/report/updateDashBoard/HotelProfit/updateDashboard");
// const updateDashboardBranchInfo = require("../../../../service/report/updateDashBoard/HotelProfit/updateDashboardBranchInfo");
// const updateCalculatorAmount = require("../../../../service/utils/updateCalculatorAmount");
// const updateSheetStatus = require("../../../../service/utils/updateSheetStatus");
// const updateTable = require("../../../../service/utils/updateTable");

// const HotelProfit = async (data) => {
//   try {
//     // Creating a new credit document in the "CardFee" collection
//     // First update: Change the daily table
//     await updateTable("tables", data.activeTable, data.deliveryguyId, "total", {
//       hotelProfit: parseInt(data.amount),
//       total: parseInt(data.amount),
//     });

//     // Second update: Change the 15 days summary and daily summary tables
//     await updateTable("tables", data.activeDailySummery, data.date, "total", {
//       hotelProfit: parseInt(data.amount),
//       total: parseInt(data.amount),
//     });

//     // Third update: Individual person's daily work summary
//     const newIncome = await updateTable(
//       "tables",
//       data.active,
//       data.deliveryguyId,
//       "total",
//       {
//         hotelProfit: parseInt(data.amount),
//         total: parseInt(data.amount),
//       }
//     );

//     // Updating sheet status with totalIncome
//     const newStatus = await updateSheetStatus(
//       data.active,
//       "totalIncome",
//       newIncome.total.total
//     );

//     // Updating dashboard with newIncome and hotelProfit details
//     await updateDashboard(
//       data.branchId,
//       newIncome.total.total,
//       newStatus.totalExpense,
//       parseInt(data.amount)
//     );

//     // Updating dashboard branch information
//     await updateDashboardBranchInfo(
//       data.branchId,
//       newIncome.total.total,
//       newStatus.totalExpense,
//       newIncome.total.hotelProfit
//     );

//     await updateCalculatorAmount(data.active, newIncome.total.total);

//     console.log("Updates completed successfully.");
//   } catch (error) {
//     console.error("Error in HotelProfit:", error);
//   }
// };

// module.exports = HotelProfit;

const updateDashboard = require("../../../../service/report/updateDashBoard/HotelProfit/updateDashboard");
const updateDashboardBranchInfo = require("../../../../service/report/updateDashBoard/HotelProfit/updateDashboardBranchInfo");
const updateCalculatorAmount = require("../../../../service/utils/updateCalculatorAmount");
const updateSheetStatus = require("../../../../service/utils/updateSheetStatus");
const updateTable = require("../../../../service/utils/updateTable");

/**
 * Update hotel profit-related data and perform necessary updates.
 *
 * @param {Object} data - The hotel profit data.
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 */
const HotelProfit = async (data, db, batch) => {
  try {
    // Creating a new credit document in the "CardFee" collection
    // First update: Change the daily table
    await updateTable(
      db,
      "tables",
      data.activeTable,
      data.deliveryguyId,
      "total",
      {
        hotelProfit: parseFloat(data.amount),
        total: parseFloat(data.amount),
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
        hotelProfit: parseFloat(data.amount),
        total: parseFloat(data.amount),
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
        hotelProfit: parseFloat(data.amount),
        total: parseFloat(data.amount),
      },
      batch
    );

    // Updating sheet status with totalIncome
    const newStatus = await updateSheetStatus(
      db,
      batch,
      data.active,
      "totalIncome",
      newIncome.total.total + parseFloat(data.amount)
    );

    // Updating dashboard with newIncome and hotelProfit details
    await updateDashboard(
      db,
      batch,
      data.branchId,
      newStatus.totalIncome,
      newStatus.totalExpense,
      parseFloat(data.amount)
    );

    // Updating dashboard branch information
    await updateDashboardBranchInfo(
      db,
      batch,
      data.branchId,
      newStatus.totalIncome,
      newStatus.totalExpense,
      newIncome.total.hotelProfit + parseFloat(data.amount)
    );

    await updateCalculatorAmount(db, batch, data.active, newStatus.totalIncome);

    console.log("Updates completed successfully.");
  } catch (error) {
    console.error("Error in HotelProfit:", error);
  }
};

module.exports = HotelProfit;
