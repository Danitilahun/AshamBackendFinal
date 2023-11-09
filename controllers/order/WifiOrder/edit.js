const admin = require("../../../config/firebase-admin"); // Import admin here
const editDocument = require("../../../service/mainCRUD/editDoc");
const createOrUpdateDocument = require("../../../service/order/createOrUpdateDocument");
const createCustomerData = require("../../../util/createCustomerData");
const generateCustomID = require("../../../util/generateCustomID");

/**
 * Edit a Wifi Order document in the "Wifi Order" Firestore collection.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */

const editWifiOrder = async (req, res) => {
  try {
    // Create Firestore database and batch from admin
    const db = admin.firestore();
    const batch = db.batch();

    // Get document ID and updated data from the request body
    const updatedData = req.body;
    const { id } = req.params;

    updatedData.status = "Assigned";

    updatedData.createdAt = admin.firestore.FieldValue.serverTimestamp();

    await editDocument(db, batch, "Wifi", id, updatedData); // Updated function call

    const customerData = createCustomerData(updatedData, "Wifi");

    const Id = generateCustomID(`${updatedData.blockHouse}`);
    await createOrUpdateDocument(db, batch, "customer", Id, customerData); // Updated function call

    // Respond with a success message

    await batch.commit();
    res
      .status(200)
      .json({ message: "Wifi Order document edited successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = editWifiOrder;
