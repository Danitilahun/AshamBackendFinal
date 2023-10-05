const disableUserAccount = require("../../../service/users/firebaseAuth/disableUser");
const revokeRefreshTokens = require("../../../service/users/firebaseAuth/revokeRefreshTokens");
const updateOrCreateFieldsInDocument = require("../../../service/utils/updateOrCreateFieldsInDocument");
const admin = require("../../../config/firebase-admin");

/**
 * Disable or enable a user in Firebase Authentication and revoke refresh tokens if disabled.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 * @throws {Error} Throws an error if there's an issue with the operation.
 */

const disableUser = async (req, res) => {
  const db = admin.firestore();
  const batch = db.batch();

  try {
    // Step 1: Extract user ID and disable flag from the request
    const { id } = req.params;
    const { disable, collectionName } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "User information is missing or invalid." });
    }

    // Step 2: Disable or enable the user account in Firebase Authentication
    await disableUserAccount(id, disable);

    // Step 3: If disabled, revoke the user's refresh tokens
    if (disable) {
      await revokeRefreshTokens(id);
    }

    // Step 4: Update or create the "disable" field in the specified Firestore collection document
    await updateOrCreateFieldsInDocument(db, batch, collectionName, id, {
      disable: disable,
    });

    await batch.commit();
    // Step 5: Respond with a success message
    res.status(200).json({ message: "User data updated successfully." });
  } catch (error) {
    // Step 6: Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = disableUser;
