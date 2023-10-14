const admin = require("../../config/firebase-admin");
const getDocumentDataById = require("../utils/getDocumentDataById");

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
  try {
    if (!customId1 || !sheetId || !branchId) {
      throw new Error(
        "Required parameters are missing.Please check your connection and try again."
      );
    }

    const bank = await getDocumentDataById("Bank", branchId);
    if (!bank) {
      throw new Error(
        "Bank information is missing.Please refresh your browser and try again."
      );
    }
    const formData = {
      200: 0,
      100: 0,
      50: 0,
      10: 0,
      5: 0,
      1: 0,
      sum: 0,
      actual:
        -(totalCredit.total ? totalCredit.total : 0) -
        (bank.total ? bank.total : 0),
      balance:
        -(totalCredit.total ? totalCredit.total : 0) -
        (bank.total ? bank.total : 0),
      totalCredit: totalCredit.total ? totalCredit.total : 0,
      active: customId1,
      dailyCredit: 0,
      income: 0,
      bank: -bank.total ? -bank.total : 0,
      sheetId: sheetId,
      branchId: branchId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Get the document reference
    const documentRef = db.collection("Calculator").doc(customId1);

    // Add the set operation to the batch
    batch.set(documentRef, formData);
  } catch (error) {
    console.error("Error in createCalculator:", error);
    throw error; // Re-throw the error to be handled at the caller's level
  }
};

module.exports = createCalculator;
