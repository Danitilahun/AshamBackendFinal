const createDocument = require("../../../service/mainCRUD/createDoc");
const createOrUpdateDocument = require("../../../service/order/createOrUpdateDocument");
const sendFCMNotification = require("../../../service/order/sendFCMNotification");
const generateCustomID = require("../../../util/generateCustomID");
const admin = require("../../../config/firebase-admin");
const removeFromDeliveryQueue = require("../../../service/users/deliveryGuyActiveness/removeFromDeliveryQueue");
const addToDeliveryQueue = require("../../../service/users/deliveryGuyActiveness/addToDeliveryQueue");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const moveDeliveryGuyToEndOfQueue = require("../../../service/users/deliveryGuyActiveness/moveDeliveryGuyToEndOfQueue");

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

    const branch = await getDocumentDataById("branches", data.cardBranch);
    if (!branch.active || !branch.activeSheet || !branch.activeTable) {
      return res.status(400).json({
        message:
          "You can't create order since there is no daily table or sheet.",
      });
    }

    if (!data.branchId || !data.deliveryguyId) {
      return res
        .status(400)
        .json({ message: "Branch ID and Delivery Guy ID are required." });
    }
    console.log(data);
    await moveDeliveryGuyToEndOfQueue(
      db,
      batch,
      data.branchId,
      data.deliveryguyId,
      data.deliveryguyName
    );
    // Create a Wifi Order document in the "Wifi Order" collection

    const customerData = {
      name: data.name,
      phone: data.phone,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      blockHouse: data.blockHouse,
      branchId: data.branchId,
      branchName: data.branchName,
      createdDate: data.createdDate,
      type: "Wifi",
    };
    console.log(customerData);

    if (data.from === "branch") {
      data.branchId = data.branchId + " normal";
    }

    await createDocument("Wifi", data, db, batch); // Updated function call
    const Id = generateCustomID(`${data.blockHouse}`);
    await createOrUpdateDocument(db, batch, "customer", Id, customerData); // Updated function call
    data.type = "Wifi";
    await sendFCMNotification(data);
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
