const admin = require("../../../config/firebase-admin");

/**
 * Delete a user from Firebase Authentication.
 *
 * @param {string} uid - The UID of the user to delete.
 * @throws {Error} Throws an error if the user deletion fails.
 */
const deleteUser = async (uid) => {
  try {
    // Delete the user from Firebase Authentication
    await admin.auth().deleteUser(uid);

    // Log a success message
    console.log(`Successfully deleted user ${uid}`);
  } catch (err) {
    // Log the error and throw it again to propagate it
    console.error(err);
    throw new Error("Failed to delete user.");
  }
};

module.exports = deleteUser;
