const admin = require("../../../config/firebase-admin");

/**
 * Create a new user in Firebase Authentication.
 *
 * @param {string} email - The email address of the user to create.
 * @param {string|null} id - The optional user ID or null.
 * @returns {Promise<string>} The UID of the newly created user.
 * @throws {Error} Throws an error if the user creation fails.
 */

const createUser = async (email, id) => {
  try {
    // Define the user creation data
    const userData = {
      email,
      password: "12345678", // Set a default password
    };

    // Conditionally set the displayName if id is not null
    if (id !== null) {
      userData.displayName = id;
    }

    // Create the user in Firebase Authentication
    const userRecord = await admin.auth().createUser(userData);

    // Extract the UID of the newly created user
    const uid = userRecord.uid;

    // Log a success message
    console.log("Successfully created new user:", uid);

    return uid;
  } catch (err) {
    // Log the error and throw it again to propagate it
    console.error(err);
    throw err;
  }
};

module.exports = createUser;
