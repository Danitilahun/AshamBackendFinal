const updateTable = require("./updateTable");

const updateDeliveryGuyData = async (db, data, batch) => {
  try {
    // First update: Change the daily table
    await updateTable(
      db,
      "tables",
      data.activeTable,
      data.deliveryguyId,
      "total",
      {
        waterCollect: 1,
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
        waterCollect: 1,
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
        waterCollect: 1,
      },
      batch
    );

    return null;
  } catch (error) {
    throw error; // Re-throw the error to handle it at the caller's level
  }
};

module.exports = updateDeliveryGuyData;
