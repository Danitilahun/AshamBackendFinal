// const admin = require("../../../config/firebase-admin");

// const createCalculatorData = async (uid) => {
//   try {
//     const formData = {
//       200: 0,
//       100: 0,
//       50: 0,
//       10: 0,
//       5: 0,
//       1: 0,
//       sum: 0,
//       actual: 0,
//       income: 0,
//       balance: 0,
//       bank: 0,
//       totalCredit: 0,
//       active: uid,
//       openingDate: new Date(),
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     };
//     await admin.firestore().collection("Calculator").doc(uid).set(formData);
//     console.log("Calculator data created successfully.");
//   } catch (error) {
//     console.error("Error in createCalculatorData:", error);
//     throw error; // Rethrow the error to propagate it up the call stack
//   }
// };

// module.exports = createCalculatorData;

const admin = require("../../../config/firebase-admin");

/**
 * Create calculator data with batch support.
 *
 * @param {string} uid - User ID.
 * @param {Firestore} db - Firestore database instance.
 * @param {WriteBatch} batch - Firestore batch instance.
 * @returns {Promise<void>} A Promise that resolves once the data is created.
 * @throws {Error} Throws an error if there's an issue with the operation.
 */
const createCalculatorData = async (uid, db, batch) => {
  try {
    const formData = {
      200: 0,
      100: 0,
      50: 0,
      10: 0,
      5: 0,
      1: 0,
      sum: 0,
      actual: 0,
      income: 0,
      balance: 0,
      bank: 0,
      totalCredit: 0,
      active: uid,
      openingDate: new Date(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Add the set operation to the batch
    const calculatorRef = db.collection("Calculator").doc(uid);
    batch.set(calculatorRef, formData);

    console.log("Calculator data created successfully.");
  } catch (error) {
    console.error("Error in createCalculatorData:", error);
    throw error; // Rethrow the error to propagate it up the call stack
  }
};

module.exports = createCalculatorData;
