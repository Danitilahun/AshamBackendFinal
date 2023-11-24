const addToDeliveryQueue = require("../../../service/users/deliveryGuyActiveness/addToDeliveryQueue");
const removeFromDeliveryQueue = require("../../../service/users/deliveryGuyActiveness/removeFromDeliveryQueue");
const updateDeliveryGuyActiveness = require("../../../service/users/deliveryGuyActiveness/updateDeliveryGuyActiveness");
const updateDashboardActiveDeliveryGuy = require("../../../service/users/updateDashboard/updateActiveDeliveryGuy");
const admin = require("../../../config/firebase-admin"); // Import Firebase Admin
/**
 * Set the activeness of a delivery guy and update related data.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Object} A JSON response indicating the result of the operation.
 */
const setDeliveryGuyActiveness = async (req, res) => {
  // Create Firestore database and batch
  const db = admin.firestore();
  const batch = db.batch();

  const { active, branchId, deliveryManId, deliveryGuyName } = req.body;
  try {
    // Wrap the entire function in a setTimeout with a one-minute delay
    await updateDeliveryGuyActiveness(deliveryManId, active, db, batch);

    if (active) {
      await updateDashboardActiveDeliveryGuy(1, db, batch);
      await addToDeliveryQueue(
        db,
        batch,
        branchId,
        deliveryManId,
        deliveryGuyName
      );
    } else {
      await removeFromDeliveryQueue(db, batch, branchId, deliveryManId);
      await updateDashboardActiveDeliveryGuy(-1, db, batch);
    }

    // Commit the batch updates
    await batch.commit();

    return res.status(200).json({ message: "Data successfully updated." });
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

module.exports = setDeliveryGuyActiveness;
