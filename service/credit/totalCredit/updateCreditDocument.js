const admin = require("../../../config/firebase-admin");

/**
 * Update a credit document in Firestore by incrementing a specified field and return the updated data.
 *
 * @param {string} customId - The custom ID of the credit document to update.
 * @param {string} field - The field to increment in the credit document.
 * @param {number} value - The value to increment the specified field by.
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @returns {Promise<Object|null>} A Promise that resolves to the updated data object if successful, or null if the document doesn't exist.
 * @throws {Error} Throws an error if the update operation fails.
 */
const updateCreditDocument = async (customId, field, value, db, batch) => {
  const creditRef = db.collection("totalCredit").doc(customId);

  try {
    if (!customId) {
      throw new Error(
        "Unable to get credit information to update.Please refresh your browser and try again."
      );
    }
    // Check if the document exists
    const creditDoc = await creditRef.get();

    if (creditDoc.exists) {
      // Document exists, increment the specified field
      batch.update(creditRef, {
        [field]: admin.firestore.FieldValue.increment(value),
        ["total"]: admin.firestore.FieldValue.increment(value),
      });

      // Return the updated data
      const updatedCreditDoc = {
        ...creditDoc.data(),
        [field]: creditDoc.get(field) + value,
        total: creditDoc.get("total") + value,
      };
      return updatedCreditDoc;
    } else {
      return null;
    }
  } catch (error) {
    // Handle the error and return an error message
    console.error("Error updating credit document:", error);
    throw error;
  }
};

module.exports = updateCreditDocument;
