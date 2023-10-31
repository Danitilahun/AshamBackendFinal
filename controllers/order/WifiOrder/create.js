const createDocument = require("../../../service/mainCRUD/createDoc");
const createOrUpdateDocument = require("../../../service/order/createOrUpdateDocument");
const sendFCMNotification = require("../../../service/order/sendFCMNotification");
const generateCustomID = require("../../../util/generateCustomID");
const admin = require("../../../config/firebase-admin");
const removeFromDeliveryQueue = require("../../../service/users/deliveryGuyActiveness/removeFromDeliveryQueue");
const addToDeliveryQueue = require("../../../service/users/deliveryGuyActiveness/addToDeliveryQueue");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const moveDeliveryGuyToEndOfQueue = require("../../../service/users/deliveryGuyActiveness/moveDeliveryGuyToEndOfQueue");
const documentExistsAndHasField = require("../../../service/utils/documentExistsAndHasField");
const updateDeliveryGuyData = require("../../../service/utils/wifiUpdate");

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

    if (!data) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }

    data.status = "Assigned";

    const check = await documentExistsAndHasField(
      "tables",
      data.activeDailySummery,
      data.date
    );

    if (!check) {
      return res.status(400).json({
        message: `You cannot create an order because there is no daily table available for the date ${data.date}. Please create a daily table for this date. If you believe you have already created a table for this day, this error may be due to an issue with your internet connection. Please check your internet connection and try again.`,
      });
    }

    // console.log(manye);
    const branch = await getDocumentDataById(
      "branches",
      data.cardBranch ? data.cardBranch : data.branchKey
    );
    if (
      !branch ||
      !branch.active ||
      !branch.activeSheet ||
      !branch.activeTable
    ) {
      return res.status(400).json({
        message:
          "You can't create order since there is no daily table or sheet.",
      });
    }

    if (!data.active || !data.activeDailySummery || !data.activeTable) {
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
      data.branchKey,
      data.deliveryguyId,
      data.deliveryguyName
    );
    // Create a Wifi Order document in the "Wifi Order" collection

    const customerData = {
      name: data.name,
      phone: data.phone,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      blockHouse: data.blockHouse,
      branchId: data.branchKey,
      branchName: data.branchName,
      createdDate: data.createdDate,
      type: "Wifi",
    };
    console.log(customerData);

    const Id = generateCustomID(`${data.blockHouse}`);
    await createOrUpdateDocument(db, batch, "customer", Id, customerData); // Updated function call

    if (data.from === "branch") {
      data.branchId = data.branchId + " normal";
    }

    await createDocument("Wifi", data, db, batch); // Updated function call

    await updateDeliveryGuyData(db, data, batch);
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
