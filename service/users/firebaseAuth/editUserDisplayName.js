const admin = require("../../../config/firebase-admin");

/**
 * Update a user's display name in Firebase Authentication.
 *
 * @param {string} uid - The UID of the user to update.
 * @param {string} newDisplayName - The new display name for the user.
 * @throws {Error} Throws an error if the display name update fails.
 */
const editUserDisplayName = async (uid, newDisplayName) => {
  if (!uid || !newDisplayName) {
    return null;
  }
  try {
    // Update the user's display name in Firebase Authentication
    await admin.auth().updateUser(uid, { displayName: newDisplayName });

    // Log a success message
    console.log(`Successfully updated display name for user ${uid}`);
  } catch (err) {
    // Log the error and throw it again to propagate it
    console.error(err);
    throw error;
  }
};

module.exports = editUserDisplayName;
