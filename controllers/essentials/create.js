const admin = require("../../config/firebase-admin");

/**
 * Create an essential document in the "essential" Firestore collection.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
const createEssentials = async (req, res) => {
  try {
    // Get data from the request body
    const data = req.body;
    if (!data) {
      return res
        .status(400)
        .json({
          message:
            "Request body is missing or empty.Please refresh your browser and try again.",
        });
    }
    data.createdAt = admin.firestore.FieldValue.serverTimestamp();
    // Get a reference to the Firestore collection
    const essentialsCollection = admin.firestore().collection("Essentials");

    // Create a new document with the provided data
    await essentialsCollection.add(data);

    // Respond with a success message
    res
      .status(200)
      .json({ message: "Essential document created successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = createEssentials;
