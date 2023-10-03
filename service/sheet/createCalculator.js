const admin = require("../../config/firebase-admin");
// /**
//  * Creates a calculator document and adds it to the "Calculator" collection.
//  * @param {string} customId1 - The custom ID 1.
//  * @param {string} sheetId - The sheet ID.
//  * @param {string} branchId - The branch ID.
//  * @param {number} totalCredit - The total credit.
//  * @returns {Promise<void>} A Promise that resolves when the calculator document is created.
//  */
// const createCalculator = async (customId1, sheetId, branchId, totalCredit) => {
//   const formData = {
//     200: 0,
//     100: 0,
//     50: 0,
//     10: 0,
//     5: 0,
//     1: 0,
//     sum: 0,
//     actual: -totalCredit.total,
//     balance: -totalCredit.total,
//     totalCredit: totalCredit.total,
//     active: customId1,
//     income: 0,
//     bank: 0,
//     sheetId: sheetId,
//     branchId: branchId,
//     createdAt: admin.firestore.FieldValue.serverTimestamp(),
//   };

//   await admin.firestore().collection("Calculator").doc(customId1).set(formData);
// };

// module.exports = createCalculator;

/**
 * Creates a calculator document and adds it to the "Calculator" collection.
 * @param {string} customId1 - The custom ID 1.
 * @param {string} sheetId - The sheet ID.
 * @param {string} branchId - The branch ID.
 * @param {number} totalCredit - The total credit.
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @returns {Promise<void>} A Promise that resolves when the calculator document is created.
 */
const createCalculator = async (
  customId1,
  sheetId,
  branchId,
  totalCredit,
  db,
  batch
) => {
  if (!customId1 || !sheetId || !branchId || !totalCredit) {
    return;
  }
  const formData = {
    200: 0,
    100: 0,
    50: 0,
    10: 0,
    5: 0,
    1: 0,
    sum: 0,
    actual: -totalCredit.total,
    balance: -totalCredit.total,
    totalCredit: totalCredit.total,
    active: customId1,
    income: 0,
    bank: 0,
    sheetId: sheetId,
    branchId: branchId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // Get the document reference
  const documentRef = db.collection("Calculator").doc(customId1);

  // Add the set operation to the batch
  batch.set(documentRef, formData);
};

module.exports = createCalculator;
