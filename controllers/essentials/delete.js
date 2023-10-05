const admin = require("../../config/firebase-admin");

/**
 * Delete an essential document from the "essential" Firestore collection.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
const deleteEssentials = async (req, res) => {
  try {
    // Get document ID from the request parameters
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({
          message:
            "Essential Id is missing.Please refresh your browser and try again.",
        });
    }
    // Get a reference to the Firestore collection
    const essentialsCollection = admin.firestore().collection("Essentials");

    // Delete the document with the provided ID
    await essentialsCollection.doc(id).delete();

    // Respond with a success message
    res
      .status(200)
      .json({ message: "Essential document deleted successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteEssentials;
