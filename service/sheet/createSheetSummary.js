// const formatDateRange = require("../../util/formatDateRange");
// const pushToFieldArray = require("../../utils/pushToFieldArray");
// const incrementFieldValue = require("../utils/IncrementFiedlValue");
// const updateFieldInCollection = require("../utils/updateFieldInCollection");

// /**
//  * Creates a summary sheet and adds it to the "Budget" collection.
//  * @param {Object} currentStatus - The current status data ("Status" document).
//  * @param {Object} totalCredit - The "totalCredit" document data.
//  * @returns {Promise<void>} A Promise that resolves when the summary sheet is created.
//  */
// const createSheetSummary = async (currentStatus, totalCredit) => {
//   console.log(currentStatus);
//   const date = formatDateRange(currentStatus.createdDate);
//   let status =
//     currentStatus.totalIncome > currentStatus.totalExpense ? "profit" : "loss";
//   status =
//     currentStatus.totalIncome === currentStatus.totalExpense
//       ? "Break-even"
//       : status;

//   const amount =
//     parseFloat(currentStatus.totalIncome) -
//     parseFloat(currentStatus.totalExpense);

//   // Create the summary sheet object by inheriting fields from currentStatus
//   const summarySheet = {
//     ...currentStatus, // Inherit fields from currentStatus (the current status)
//     date: date, // Overwrite date with the new date
//     dayRange: date,
//     Sheetstatus: status, // Add status
//     amount: amount, // Add amount
//     totalCredit: totalCredit ? totalCredit.total : 0, // Add totalCredit or set to 0 if not available
//   };

//   // Add the summary sheet to the "Budget" collection
//   await pushToFieldArray(
//     "Budget",
//     currentStatus.branchId,
//     "sheetSummary",
//     summarySheet
//   );

//   await incrementFieldValue("Budget", currentStatus.branchId, "total", amount);

//   await updateFieldInCollection("finance", "BudgetSummery", amount);
// };

// module.exports = createSheetSummary;

// const admin = require("../../config/firebase-admin");
const formatDateRange = require("../../util/formatDateRange");
const pushToFieldArray = require("../../utils/pushToFieldArray");
const incrementFieldValue = require("../utils/IncrementFiedlValue");
const updateFieldInCollection = require("../utils/updateFieldInCollection");
const updateDocumentWithPushAndIncrement = require("./updateDocumentWithPushAndIncrement");

/**
 * Creates a summary sheet and adds it to the "Budget" collection.
 * @param {Object} currentStatus - The current status data ("Status" document).
 * @param {Object} totalCredit - The "totalCredit" document data.
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @returns {Promise<void>} A Promise that resolves when the summary sheet is created.
 */
const createSheetSummary = async (currentStatus, totalCredit, db, batch) => {
  const date = formatDateRange(currentStatus.createdDate);
  let status =
    currentStatus.totalIncome > currentStatus.totalExpense ? "profit" : "loss";
  status =
    currentStatus.totalIncome === currentStatus.totalExpense
      ? "Break-even"
      : status;

  const amount =
    parseFloat(currentStatus.totalIncome) -
    parseFloat(currentStatus.totalExpense);

  // Create the summary sheet object by inheriting fields from currentStatus
  const summarySheet = {
    ...currentStatus, // Inherit fields from currentStatus (the current status)
    date: date, // Overwrite date with the new date
    dayRange: date,
    Sheetstatus: status, // Add status
    amount: amount, // Add amount
    totalCredit: totalCredit ? totalCredit.total : 0, // Add totalCredit or set to 0 if not available
  };

  await updateDocumentWithPushAndIncrement(
    db,
    batch,
    "Budget",
    currentStatus.branchId,
    "sheetSummary",
    "total",
    summarySheet,
    amount
  );
  await updateFieldInCollection(db, batch, "finance", "BudgetSummery", amount);
};

module.exports = createSheetSummary;
