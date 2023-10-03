const admin = require("../../../config/firebase-admin");

/**
 * Update a user's email in Firebase Authentication.
 *
 * @param {string} uid - The UID of the user to update.
 * @param {string} newEmail - The new email address for the user.
 * @throws {Error} Throws an error if the email update fails.
 */
const editUserEmail = async (uid, newEmail) => {
  try {
    // Update the user's email in Firebase Authentication
    await admin.auth().updateUser(uid, { email: newEmail });

    // Log a success message
    console.log(`Successfully updated email for user ${uid}`);
  } catch (err) {
    // Log the error and throw it again to propagate it
    console.error(err);
    throw err;
  }
};

module.exports = editUserEmail;
