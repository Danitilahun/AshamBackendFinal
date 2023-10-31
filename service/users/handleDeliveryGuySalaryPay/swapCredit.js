const admin = require("../../../config/firebase-admin");
const updateDashboard = require("../../credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../credit/dashboard/updateDashboardBranchInfo");
const updateCreditDocument = require("../../credit/totalCredit/updateCreditDocument");
const updateCalculator = require("../../credit/updateCalculator/updateCalculator");
const updateDeliveryGuy = require("../../credit/updateDeliveryGuy/updateDeliveryGuy");
const updateSalaryTable = require("../../credit/updateSalaryTable/updateSalaryTable");
const updateSheetStatus = require("../../credit/updateSheetStatus/updateSheetStatus");
const deleteDocumentsAndGetSum = require("../../utils/deleteDocuments");

const swapCredit = async (id, data, active, db, batch) => {
  try {
    const Credit_from_amount_normal = await deleteDocumentsAndGetSum(
      "DailyCredit",
      id,
      db,
      batch
    );

    const creditCollection = db.collection("StaffCredit");

    const newData = {
      employeeId: id,
      placement: "DeliveryGuy",
      employeeName: data.fullName,
      amount: parseInt(Credit_from_amount_normal),
      branchId: data.branchId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      date: new Date(),
      type: "StaffCredit",
      reason: "Do not complete the daily credit return.",
      active: active,
    };

    const newCreditRef = creditCollection.doc();
    batch.set(newCreditRef, newData);

    // console.log();
    await updateDeliveryGuy(
      db,
      batch,
      id,
      "dailyCredit",
      -parseInt(Credit_from_amount_normal)
    );

    // // Update Salary table
    // const newSalaryTable = await updateSalaryTable(
    //   "salary",
    //   active,
    //   id,
    //   "total",
    //   {
    //     totalCredit: parseInt(Credit_from_amount_normal),
    //     total: -parseInt(Credit_from_amount_normal),
    //   },
    //   db,
    //   batch
    // );

    // Determine the SalaryType based on placement
    return Credit_from_amount_normal;
  } catch (error) {
    throw error;
  }
};

module.exports = swapCredit;
