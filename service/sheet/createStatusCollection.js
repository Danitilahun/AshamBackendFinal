const admin = require("../../config/firebase-admin");

// const createStatusCollection = async (id, date, branch, branchId) => {
//   const db = admin.firestore();
//   const deliveryTurnCollectionRef = db.collection("Status").doc(id);
//   const deliveryTurnDocumentSnapshot = await deliveryTurnCollectionRef.get();

//   const statusData = {
//     totalStaffSalary: parseInt(branch.totalStaffSalary),
//     totalDeliveryGuySalary: 0,
//     totalIncome: 0,
//     totalExpense: 0,
//     totaltax: 0,
//     date: new Date(),
//     createdDate: date,
//     branchId: branchId,
//     ethioTelBill: parseInt(branch.ethioTelBill) || 0,
//     houseKeeper: parseInt(branch.houseKeeper) || 0,
//     cleanerSalary: parseInt(branch.cleanerSalary) || 0,
//     houseRent: parseInt(branch.houseRent) || 0,
//     wifi: parseInt(branch.wifi) || 0,
//     taxPersentage: parseInt(branch.taxPersentage) || 0,
//   };

//   // Check if ExpenseOneName exists and is not empty
//   if (branch.ExpenseOneName && branch.ExpenseOneName.trim() !== "") {
//     statusData[branch.ExpenseOneName] = parseInt(branch.ExpenseOneAmount) || 0;
//   }
//   if (branch.ExpenseTwoName && branch.ExpenseTwoName.trim() !== "") {
//     statusData[branch.ExpenseTwoName] = parseInt(branch.ExpenseTwoAmount) || 0;
//   }
//   if (branch.ExpenseThreeName && branch.ExpenseThreeName.trim() !== "") {
//     statusData[branch.ExpenseThreeName] =
//       parseInt(branch.ExpenseThreeAmount) || 0;
//   }

//   // Calculate the total expense by summing all numeric fields except taxPersentage
//   statusData.totalExpense = Object.entries(statusData)
//     .filter(
//       ([key, value]) => typeof value === "number" && key !== "taxPersentage"
//     )
//     .reduce((sum, [key, value]) => sum + value, 0);

//   if (!deliveryTurnDocumentSnapshot.exists) {
//     return deliveryTurnCollectionRef.set(statusData);
//   }
// };

// module.exports = createStatusCollection;

/**
 * Creates a status collection document and adds it to the "Status" collection.
 * @param {string} id - The ID of the status collection document.
 * @param {Date} date - The date of the status data.
 * @param {Object} branch - The branch data.
 * @param {string} branchId - The ID of the branch.
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @returns {Promise<void>} A Promise that resolves when the status collection document is created.
 */
const createStatusCollection = async (
  id,
  date,
  branch,
  branchId,
  db,
  batch
) => {
  if (!id || !date || !branch || !branchId) {
    return;
  }
  const deliveryTurnCollectionRef = db.collection("Status").doc(id);
  const deliveryTurnDocumentSnapshot = await deliveryTurnCollectionRef.get();

  const statusData = {
    totalStaffSalary: parseInt(branch.totalStaffSalary),
    totalDeliveryGuySalary: 0,
    totalIncome: 0,
    totalExpense: 0,
    totaltax: 0,
    date: new Date(),
    createdDate: date,
    branchId: branchId,
    ethioTelBill: parseInt(branch.ethioTelBill) || 0,
    houseRent: parseInt(branch.houseRent) || 0,
    wifi: parseInt(branch.wifi) || 0,
    taxPersentage: parseInt(branch.taxPersentage) || 0,
  };

  // Check if ExpenseOneName exists and is not empty
  if (branch.ExpenseOneName && branch.ExpenseOneName.trim() !== "") {
    statusData[branch.ExpenseOneName] = parseInt(branch.ExpenseOneAmount) || 0;
  }
  if (branch.ExpenseTwoName && branch.ExpenseTwoName.trim() !== "") {
    statusData[branch.ExpenseTwoName] = parseInt(branch.ExpenseTwoAmount) || 0;
  }
  if (branch.ExpenseThreeName && branch.ExpenseThreeName.trim() !== "") {
    statusData[branch.ExpenseThreeName] =
      parseInt(branch.ExpenseThreeAmount) || 0;
  }

  // Calculate the total expense by summing all numeric fields except taxPersentage
  statusData.totalExpense = Object.entries(statusData)
    .filter(
      ([key, value]) => typeof value === "number" && key !== "taxPersentage"
    )
    .reduce((sum, [key, value]) => sum + value, 0);

  if (!deliveryTurnDocumentSnapshot.exists) {
    // Add the set operation to the batch
    batch.set(deliveryTurnCollectionRef, statusData);
  }
};

module.exports = createStatusCollection;
