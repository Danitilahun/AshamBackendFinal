// authService.js
const admin = require("../../../config/firebase-admin");

/**
 * Disable a user in Firebase Authentication.
 * @param {string} userId - The ID of the user to disable.
 * @param {boolean} disable - Whether to disable the user or not.
 * @returns {Promise<void>} A Promise that resolves when the user is disabled or enabled.
 */
const disableUserAccount = async (userId, disable) => {
  if (!userId) {
    return;
  }
  try {
    await admin.auth().updateUser(userId, { disabled: disable });
  } catch (error) {
    console.error("Error disabling/enabling user:", error);
    throw error;
  }
};

module.exports = disableUserAccount;
