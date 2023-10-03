const admin = require("../../../config/firebase-admin");
/**
 * Revoke refresh tokens for a user in Firebase Authentication.
 * @param {string} userId - The ID of the user for whom to revoke refresh tokens.
 * @returns {Promise<void>} A Promise that resolves when the refresh tokens are revoked.
 */
const revokeRefreshTokens = async (userId) => {
  try {
    await admin.auth().revokeRefreshTokens(userId);
  } catch (error) {
    console.error("Error revoking refresh tokens:", error);
    throw error;
  }
};

module.exports = revokeRefreshTokens;
