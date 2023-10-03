const { v4: UUID } = require("uuid");
const parseForm = require("../../../util/formParser");
const uploadProfileImage = require("../../../util/uploadProfileImage");
const updateOrCreateFieldsInDocument = require("../../../service/utils/updateOrCreateFieldsInDocument");
const admin = require("../../../config/firebase-admin");
/**
 * Update the profile picture of an admin user in the "admin" Firestore collection.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 * @throws {Error} Throws an error if the operation fails.
 */
const updateProfilePicture = async (req, res) => {
  const db = admin.firestore();
  const batch = db.batch();

  try {
    // Step 1: Get admin user ID from the request parameters
    const { id } = req.params;

    // Step 2: Parse form data to retrieve updated fields and files
    const { fields, files } = await parseForm(req);

    // Step 3: Generate a unique identifier (UUID)
    let uuid = UUID();

    // Step 4: Upload the new profile image and get its URL
    const imageUrl = await uploadProfileImage(
      files.profileImage,
      uuid,
      "admin"
    );

    // Step 5: Create an object with the updated profile image URL
    const updatedData = {
      profileImage: imageUrl,
    };

    // Step 6: Update or create fields in the "admin" document for the specified ID
    await updateOrCreateFieldsInDocument(
      db,
      batch,
      fields.collectionName,
      id,
      updatedData
    );

    await batch.commit();
    // Step 7: Respond with a success message
    res.status(200).json({ message: "Profile picture updated successfully." });
  } catch (error) {
    // Step 8: Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = updateProfilePicture;
