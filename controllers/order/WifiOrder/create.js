const admin = require("../../../config/firebase-admin");
const createDocument = require("../../../service/mainCRUD/createDoc");
const createOrUpdateDocument = require("../../../service/order/createOrUpdateDocument");
const generateCustomID = require("../../../util/generateCustomID");
const moveDeliveryGuyToEndOfQueue = require("../../../service/users/deliveryGuyActiveness/moveDeliveryGuyToEndOfQueue");
const createCustomerData = require("../../../util/createCustomerData");

/**
 * Create a Wifi Order document in the "Wifi Order" Firestore collection.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
const createWifiOrder = async (req, res) => {
  try {
    // Create Firestore database and batch from admin
    const db = admin.firestore();
    const batch = db.batch();

    // Get data from the request body
    const data = req.body;

    data.status = "Assigned";

    await moveDeliveryGuyToEndOfQueue(
      db,
      batch,
      data.branchKey,
      data.deliveryguyId,
      data.deliveryguyName
    );
    // Create a Wifi Order document in the "Wifi Order" collection

    const customerData = createCustomerData(data, "Wifi");

    const Id = generateCustomID(`${data.blockHouse}`);

    await createOrUpdateDocument(db, batch, "customer", Id, customerData); // Updated function call

    if (data.from === "branch") {
      data.branchId = data.branchId + " normal";
    }

    await createDocument("Wifi", data, db, batch); // Updated function call

    // Respond with a success message

    await batch.commit();

    res
      .status(200)
      .json({ message: "Wifi Order document created successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = createWifiOrder;
