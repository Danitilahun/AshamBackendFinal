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
 * Create a Water Order document in the "Water Order" Firestore collection.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch instance.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
const createWaterOrder = async (req, res) => {
  const db = admin.firestore();
  const batch = db.batch();
  try {
    // Get data from the request body
    const data = req.body;
    if (!data) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }

    const branch = await getDocumentDataById("branches", data.cardBranch);
    if (!branch.active || !branch.activeSheet || !branch.activeTable) {
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

    await moveDeliveryGuyToEndOfQueue(
      db,
      batch,
      data.branchId,
      data.deliveryguyId,
      data.deliveryguyName
    ); // Updated function call

    // Create a Water Order document in the "Water Order" collection
    const customerData = {
      name: data.name,
      phone: data.phone,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      blockHouse: data.blockHouse,
      branchId: data.branchId,
      branchName: data.branchName,
      createdDate: data.createdDate,
      type: "Water",
    };

    if (data.from === "branch") {
      data.branchId = data.branchId + " normal";
    }

    await createDocument("Water", data, db, batch); // Updated function call
    const Id = generateCustomID(`${data.blockHouse}`);
    await createOrUpdateDocument(db, batch, "customer", Id, customerData); // Updated function call
    data.type = "Water";
    await sendFCMNotification(data);
    // Respond with a success message

    await batch.commit();
    res
      .status(200)
      .json({ message: "Water Order document created successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = createWaterOrder;
