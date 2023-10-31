const editDocument = require("../../../service/mainCRUD/editDoc");
const createOrUpdateDocument = require("../../../service/order/createOrUpdateDocument");
const sendFCMNotification = require("../../../service/order/sendFCMNotification");
const generateCustomID = require("../../../util/generateCustomID");
const admin = require("../../../config/firebase-admin"); // Import admin here
const updateDeliveryGuyData = require("../../../service/utils/wifiUpdate");
const returnDeliveryGuyData = require("../../../service/utils/wifiReturn");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");

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
    console.log(updatedData);
    if (!updatedData || !id) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }

    updatedData.status = "Assigned";

    updatedData.createdAt = admin.firestore.FieldValue.serverTimestamp();

    // Edit the Wifi Order document in the "Wifi Order" collection
    const WifiData = await getDocumentDataById("Wifi", id); // Updated function call
    if (updatedData.fromWhere === "edit") {
      if (WifiData.deliveryguyId !== updatedData.deliveryguyId) {
        await updateDeliveryGuyData(db, updatedData, batch);
        await returnDeliveryGuyData(db, WifiData, batch);
      }
    } else {
      await updateDeliveryGuyData(db, updatedData, batch);
    }
    await editDocument(db, batch, "Wifi", id, updatedData); // Updated function call

    const customerData = {
      name: updatedData.name,
      phone: updatedData.phone,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      blockHouse: updatedData.blockHouse,
      branchId: updatedData.branchKey,
      branchName: updatedData.branchName,
      createdDate: updatedData.createdDate,
      type: "Wifi",
    };

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
