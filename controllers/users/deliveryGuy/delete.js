const deleteDocument = require("../../../service/mainCRUD/deleteDoc");
const removeFromDeliveryQueue = require("../../../service/users/deliveryGuyActiveness/removeFromDeliveryQueue");
const updateDashboardActiveDeliveryGuy = require("../../../service/users/updateDashboard/updateActiveDeliveryGuy");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const incrementFieldByOne = require("../../../service/utils/incrementFieldByOne");
const popArrayElement = require("../../../service/utils/popArrayElementFromObject");
const admin = require("../../../config/firebase-admin"); // Import Firebase Admin
const updateDashboardTotalEmployees = require("../../../service/users/updateDashboard/updateEmployeCount");
/**
 * Delete a delivery guy document from the "deliveryguy" Firestore collection.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 * @throws {Error} Throws an error if the operation fails.
 */
const deleteDeliveryGuy = async (req, res) => {
  // Create Firestore database and batch
  const db = admin.firestore();
  const batch = db.batch();

  try {
    // Step 1: Get delivery guy ID from the request parameters
    const { id } = req.params;

    // Step 2: Retrieve delivery guy data by ID
    const deliveryGuyData = await getDocumentDataById("deliveryguy", id);

    // Step 3: Delete the delivery guy document from the "deliveryguy" collection
    await deleteDocument(db, batch, "deliveryguy", id);

    // Step 4: Check if the delivery guy is active
    if (deliveryGuyData.activeness) {
      // Step 5: Update the dashboard's active delivery guy count (decrement by 1)
      await updateDashboardActiveDeliveryGuy(-1, db, batch);
      await removeFromDeliveryQueue(db, batch, deliveryGuyData.branch, id);
    }
    // Step 6: Get the branch ID associated with the delivery guy

    // Step 7: Decrement the "numberofworker" field in the "branches" document by 1
    await incrementFieldByOne(
      "branches",
      deliveryGuyData.branchId,
      "numberofworker",
      -1,
      db,
      batch
    );
    await updateDashboardTotalEmployees(-1, db, batch);
    await popArrayElement(
      "worker",
      { id: id },
      deliveryGuyData.branchId,
      "branches",
      db,
      batch
    );
    // Step 8: Respond with a success message
    // Commit the batch updates
    await batch.commit();
    res
      .status(200)
      .json({ message: "Delivery guy document deleted successfully." });
  } catch (error) {
    // Step 9: Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteDeliveryGuy;
