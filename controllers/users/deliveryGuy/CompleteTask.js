const admin = require("../../../config/firebase-admin"); // Import Firebase Admin
// const updateDashboard = require("../../../service/credit/dashboard/updateDashboard");
// const updateDashboardBranchInfo = require("../../../service/credit/dashboard/updateDashboardBranchInfo");
const updateDashboard = require("../../../service/report/updateDashBoard/AsbezaProfit/updateDashboard");
const updateDashboardBranchInfo = require("../../../service/report/updateDashBoard/AsbezaProfit/updateDashboardBranchInfo");
const completeAll = require("../../../service/utils/completeAll");
const documentExistsAndHasField = require("../../../service/utils/documentExistsAndHasField");
const getDocuments = require("../../../service/utils/getDocuments");
const getSingleDocFromCollection = require("../../../service/utils/getSingleDocFromCollection");
const updateSheetStatus = require("../../../service/utils/newUpdateStatus");
const payDeliveryGuy = require("../../../service/utils/payForDeliveryGuyService");
const updateCalculatorAmount = require("../../../service/utils/updateCalculatorAmount");
// const updateSheetStatus = require("../../../service/utils/updateSheetStatus");
const updateStatusToCompleted = require("../../../service/utils/updateStatusToCompleted");
const updateTable = require("../../../service/utils/updateTable");

const completeTask = async (req, res) => {
  const {
    branchId,
    deliveryguyId,
    date,
    active,
    activeTable,
    activeDailySummery,
  } = req.body;

  // Check if the required parameters are provided in the request body
  if (!branchId || !deliveryguyId || !date) {
    return res
      .status(400)
      .json({ message: "Invalid request body. Missing parameters." });
  }

  if (!active || !activeTable || !activeDailySummery) {
    return res.status(400).json({
      message:
        "Branch sheet information is missing. Please check your sheet and internet connection and try again.",
    });
  }

  const check = await documentExistsAndHasField(
    "tables",
    activeDailySummery,
    date
  );

  if (!check) {
    return res.status(400).json({
      message:
        "You can't create order since there is no daily table. Please create a daily table first.",
    });
  }

  // Create Firestore database and batch
  const db = admin.firestore();
  const batch = db.batch();

  try {
    async function getDocumentCount(
      documentType,
      branchId,
      deliveryguyId,
      date,
      status
    ) {
      const documents = await getDocuments(
        documentType,
        branchId,
        deliveryguyId,
        date,
        status
      );
      const documents2 = await getDocuments(
        documentType,
        branchId + " normal",
        deliveryguyId,
        date,
        status
      );
      return documents.length + documents2.length;
    }

    const AsbezaCount = await getDocumentCount(
      "Asbeza",
      branchId,
      deliveryguyId,
      date,
      "Assigned"
    );
    const CardCount = await getDocumentCount(
      "Card",
      branchId,
      deliveryguyId,
      date,
      "Assigned"
    );
    const WaterCount = await getDocumentCount(
      "Water",
      branchId,
      deliveryguyId,
      date,
      "Assigned"
    );
    const WifiCount = await getDocumentCount(
      "Wifi",
      branchId,
      deliveryguyId,
      date,
      "Assigned"
    );
    console.log(AsbezaCount, CardCount, WaterCount, WifiCount);
    const total = AsbezaCount + CardCount + WaterCount + WifiCount;
    if (total == 0) {
      return res.status(200).json({
        message:
          "The delivery guy does not have any assigned tasks. Any orders that were assigned to them have either been completed or are new orders that have not yet been assigned.",
      });
    }

    await completeAll(db, batch, branchId, deliveryguyId, date, "Assigned");

    const result = await payDeliveryGuy(
      db,
      {
        active: active,
        branchId: branchId,
        deliveryguyId: deliveryguyId,
      },
      batch,
      AsbezaCount,
      CardCount,
      WifiCount,
      WaterCount
    );
    console.log("result", result);
    const totalExp = result[0];
    const oldSalary = result[1];
    console.log(totalExp, oldSalary);
    const companyGain = await getSingleDocFromCollection("companyGain");

    if (!companyGain) {
      return res.status(404).json({
        message: "Company gain not found",
        type: "info",
      });
    }

    const NOA = AsbezaCount;
    // First update: Change the daily table
    await updateTable(
      db,
      "tables",
      activeTable,
      deliveryguyId,
      "total",
      {
        asbezaProfit: parseInt(NOA) * companyGain.asbeza_profit,
        total: parseInt(NOA) * companyGain.asbeza_profit,
      },
      batch
    );

    // Second update: Change the 15 days summery and daily summery tables
    await updateTable(
      db,
      "tables",
      activeDailySummery,
      date,
      "total",
      {
        asbezaProfit: parseInt(NOA) * companyGain.asbeza_profit,
        total: parseInt(NOA) * companyGain.asbeza_profit,
      },
      batch
    );

    // Third update: Individual person's daily work summery
    const newIncome = await updateTable(
      db,
      "tables",
      active,
      deliveryguyId,
      "total",
      {
        asbezaProfit: parseInt(NOA) * companyGain.asbeza_profit,
        total: parseInt(NOA) * companyGain.asbeza_profit,
      },
      batch
    );

    // Check if 'newIncome' is null
    if (!newIncome) {
      return res.status(500).json({
        message: "Failed to update income",
        type: "error",
      });
    }

    // Updating sheet status with totalDeliveryGuySalary
    const newStatus = await updateSheetStatus(
      db,
      batch,
      active,
      "totalDeliveryGuySalary",
      totalExp + oldSalary,
      newIncome.total.total + parseInt(NOA) * companyGain.asbeza_profit
    );

    // Check if 'newStatus' is null
    console.log(newStatus);
    if (!newStatus) {
      return res.status(500).json({
        message: "Failed to update sheet status",
        type: "error",
      });
    }

    // Updating dashboard with newIncome and newSalaryExpense details
    await updateDashboard(
      db,
      batch,
      branchId,
      newStatus.totalIncome,
      newStatus.totalExpense,
      parseInt(NOA) * companyGain.asbeza_profit
    );

    // Updating dashboard branch information
    await updateDashboardBranchInfo(
      db,
      batch,
      branchId,
      newStatus.totalIncome,
      newStatus.totalExpense,
      newIncome.total.asbezaProfit + parseInt(NOA) * companyGain.asbeza_profit
    );

    await updateCalculatorAmount(db, batch, active, newStatus.totalIncome);

    // Commit the batch updates
    await batch.commit();

    res.status(200).json({ message: "Task completed successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  completeTask,
};
