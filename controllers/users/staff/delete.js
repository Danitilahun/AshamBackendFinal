const deleteDocument = require("../../../service/mainCRUD/deleteDoc");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const incrementFieldByOne = require("../../../service/utils/incrementFieldByOne");
const popArrayElement = require("../../../service/utils/popArrayElementFromObject");
const admin = require("../../../config/firebase-admin");

/**
 * Delete a delivery guy document from the "deliveryguy" Firestore collection.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 * @throws {Error} Throws an error if the operation fails.
 */
const deleteStaff = async (req, res) => {
  // Create Firestore database and batch
  const db = admin.firestore();
  const batch = db.batch();

  try {
    // Step 1: Get delivery guy ID from the request parameters
    const { id } = req.params;

    // Step 2: Retrieve delivery guy data by ID
    const staffData = await getDocumentDataById("staff", id);

    // Step 3: Delete the delivery guy document from the "deliveryguy" collection
    await deleteDocument(db, batch, "staff", id);

    // Step 6: Get the branch ID associated with the delivery guy
    const branchId = staffData.branchId;

    // Step 7: Decrement the "numberofworker" field in the "branches" document by 1
    await incrementFieldByOne(
      "branches",
      branchId,
      "numberofworker",
      -1,
      db,
      batch
    );
    await popArrayElement(
      "worker",
      { id: id },
      branchId,
      "branches",
      db,
      batch
    );

    // Commit the batch updates
    await batch.commit();
    // Step 8: Respond with a success message
    res.status(200).json({ message: "Staff document deleted successfully." });
  } catch (error) {
    // Step 9: Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteStaff;
