const admin = require("../../config/firebase-admin");

/**
 * Edit an essential document in the "CardFee" Firestore collection.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
const returnedCard = async (req, res) => {
  try {
    // Get document ID and updated data from the request body
    const updatedData = req.body;
    const { id } = req.params;

    if (!updatedData || !id) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }

    // Get a reference to the Firestore collection and the document to be updated
    const db = admin.firestore();
    const documentRef = db.collection("CardFee").doc(id);

    // Update the document with the new data
    await documentRef.update(updatedData);

    // Respond with a success message
    res
      .status(200)
      .json({ message: "Returned card report successfully registered." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = returnedCard;
