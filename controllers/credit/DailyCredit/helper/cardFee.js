const updateCreditDocument = require("../../../../service/credit/totalCredit/updateCreditDocument");
const updateCalculator = require("../../../../service/credit/updateCalculator/updateCalculator");
const updateCalculatorActual = require("../../../../service/utils/updateCalculatorActual");
const updateCalculatorAmount = require("../../../../service/utils/updateCalculatorAmount");
const updateTable = require("../../../../service/utils/updateTable");

const CardFee = async (data, db, batch) => {
  try {
    console.log(data, "data");
    // First update: Update the "tables" collection with cardFee: 1
    await updateTable(
      db,
      "tables",
      data.activeTable,
      data.deliveryguyId,
      "total",
      {
        cardFee: 1,
      },
      batch
    );

    console.log(data.activeDailySummery, data.date, "total");
    // Second update: Change the 15 days summary and daily summary tables
    await updateTable(
      db,
      "tables",
      data.activeDailySummery,
      data.date,
      "total",
      {
        cardFee: 1,
      },
      batch
    );

    // Third update: Individual person's daily work summary
    await updateTable(
      db,
      "tables",
      data.active,
      data.deliveryguyId,
      "total",
      {
        cardFee: 1,
      },
      batch
    );

    // await updateCalculatorActual(
    //   db,
    //   batch,
    //   data.active,
    //   parseFloat(data.price) ? parseFloat(data.price) : 0
    // );

    // Update the total credit by subtracting the deleted credit amount
    const updatedTotalCredit = await updateCreditDocument(
      data.branchId,
      "DailyCredit",
      -parseFloat(data ? data.price : 0), // Subtract the deleted credit amount
      db,
      batch
    );

    // Update the calculator with the new total credit
    if (updatedTotalCredit) {
      await updateCalculator(
        data.active,
        parseFloat(updatedTotalCredit.total ? updatedTotalCredit.total : 0),
        db,
        batch
      );
    }
    console.log("Updates completed successfully.");
  } catch (error) {
    console.error("Error in updateDeliveryAndDashboard:", error);
    throw error;
  }
};

module.exports = CardFee;
