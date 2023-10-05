const admin = require("../../config/firebase-admin");

/**
 * Edit an essential document in the "essential" Firestore collection.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
const editEssentials = async (req, res) => {
  try {
    // Get document ID and updated data from the request body
    const updatedData = req.body;
    const { id } = req.params;

    if (!updatedData || !id) {
      return res
        .status(400)
        .json({
          message:
            "Request body is missing or empty.Please refresh your browser and try again.",
        });
    }
    // Get a reference to the Firestore collection
    const essentialsCollection = admin.firestore().collection("Essentials");

    // Update the document with the provided ID with the new data
    await essentialsCollection.doc(id).update(updatedData);

    // Respond with a success message
    res
      .status(200)
      .json({ message: "Essential document edited successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = editEssentials;
