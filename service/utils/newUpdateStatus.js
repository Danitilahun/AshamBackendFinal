/**
 * Update a document in the "Status" collection in Firestore using a batch.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} customId - The custom ID of the document to update.
 * @param {string} expenseType - The type of expense field to update.
 * @param {number} value - The value to set for the specified expense field.
 * @returns {Promise<Object|null>} A Promise that resolves to the updated data object if successful, or null if the document doesn't exist.
 * @throws {Error} Throws an error if the update operation fails.
 */

const updateSheetStatus = async (
  db,
  batch,
  customId,
  expenseType,
  value,
  totalIncome
) => {
  if (!customId) {
    throw new Error(
      "Sheet status informatin is missing.Please refresh your browser and try again."
    );
  }
  const creditRef = db.collection("Status").doc(customId);

  try {
    // Check if the document exists
    const creditDoc = await creditRef.get();

    const updateData = {};
    if (creditDoc.exists) {
      updateData[expenseType] = parseInt(value ? value : 0);
      updateData["totalIncome"] = parseInt(totalIncome);
      updateData["totaltax"] =
        parseInt(totalIncome) * parseInt(creditDoc.get("taxPersentage")) * 0.01;

      updateData["totalExpense"] =
        parseInt(creditDoc.get("totalExpense")) +
        updateData["totaltax"] -
        parseInt(creditDoc.get("totaltax")) -
        creditDoc.get(expenseType) +
        (value ? value : 0);
    }

    batch.update(creditRef, updateData);

    // Return the updated data
    return updateData;
  } catch (error) {
    console.error("Error updating sheet status:", error);
    throw error; // Re-throw the error to handle it at the caller's level
  }
};

module.exports = updateSheetStatus;
