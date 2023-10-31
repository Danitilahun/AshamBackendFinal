const editDocument = require("../../../service/mainCRUD/editDoc");
const createOrUpdateDocument = require("../../../service/order/createOrUpdateDocument");
const sendFCMNotification = require("../../../service/order/sendFCMNotification");
const generateCustomID = require("../../../util/generateCustomID");
const admin = require("../../../config/firebase-admin");
const updateDeliveryGuyData = require("../../../service/utils/waterUpdate");
const returnDeliveryGuyData = require("../../../service/utils/waterReturn");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");

/**
 * Edit a Water Order document in the "Water Order" Firestore collection.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch instance.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
const editWaterOrder = async (req, res) => {
  const db = admin.firestore();
  const batch = db.batch();
  try {
    // Get document ID and updated data from the request body
    const updatedData = req.body;
    const { id } = req.params;
    if (!updatedData || !id) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }

    updatedData.status = "Assigned";

    updatedData.createdAt = admin.firestore.FieldValue.serverTimestamp();

    // Edit the Water Order document in the "Water Order" collection

    const WaterData = await getDocumentDataById("Water", id);
    if (updatedData.fromWhere === "edit") {
      if (WaterData.deliveryguyId !== updatedData.deliveryguyId) {
        await updateDeliveryGuyData(db, updatedData, batch);
        await returnDeliveryGuyData(db, WaterData, batch);
      }
    } else {
      await updateDeliveryGuyData(db, updatedData, batch);
    }
    await editDocument(db, batch, "Water", id, updatedData); // Updated function call

    const customerData = {
      name: updatedData.name,
      phone: updatedData.phone,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      blockHouse: updatedData.blockHouse,
      branchId: updatedData.branchKey,
      branchName: updatedData.branchName,
      createdDate: updatedData.createdDate,
      type: "Water",
    };

    const Id = generateCustomID(`${updatedData.blockHouse}`);
    await createOrUpdateDocument(db, batch, "customer", Id, customerData); // Updated function call

    // Respond with a success message
    await batch.commit();
    res
      .status(200)
      .json({ message: "Water Order document edited successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = editWaterOrder;
