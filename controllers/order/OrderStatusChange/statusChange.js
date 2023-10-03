const admin = require("../../../config/firebase-admin");
const updateDocumentStatus = require("../../../service/order/updateDocumentStatus");
/**
 * Change the status of a document in a Firestore collection.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
const changeStatus = async (req, res) => {
  const docId = req.params.docId;
  const collectionName = req.body.collectionName;
  const newStatus = req.body.newStatus;
  const db = admin.firestore();
  const batch = db.batch();

  try {
    const statusUpdated = await updateDocumentStatus(
      db,
      batch,
      collectionName,
      docId,
      newStatus
    );

    if (statusUpdated) {
      // Commit the batch update
      await batch.commit();
      res.status(200).json({ message: "Status updated successfully." });
    } else {
      res.status(404).json({ message: "Document not found." });
    }
  } catch (error) {
    console.error("Error updating status:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating status." });
  }
};

module.exports = changeStatus;
