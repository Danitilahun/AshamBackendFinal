const admin = require("../../../config/firebase-admin");
const createDocument = require("../../../service/mainCRUD/createDoc");
const createOrUpdateDocument = require("../../../service/order/createOrUpdateDocument");
const sendFCMNotification = require("../../../service/order/sendFCMNotification");
const generateCustomID = require("../../../util/generateCustomID");
const removeFromDeliveryQueue = require("../../../service/users/deliveryGuyActiveness/removeFromDeliveryQueue");
const addToDeliveryQueue = require("../../../service/users/deliveryGuyActiveness/addToDeliveryQueue");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const moveDeliveryGuyToEndOfQueue = require("../../../service/users/deliveryGuyActiveness/moveDeliveryGuyToEndOfQueue");

/**
 * Create an Asbeza Order document in the "Asbeza Order" Firestore collection.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch instance.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
const createAsbezaOrder = async (req, res) => {
  const db = admin.firestore();
  const batch = db.batch(); // Create a Firestore batch
  try {
    // Get data from the request body
    const data = req.body;
    console.log(data);

    const branch = await getDocumentDataById("branches", data.branchId);
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

    // Create an Asbeza Order document in the "Asbeza Order" collection

    await moveDeliveryGuyToEndOfQueue(
      db,
      batch,
      data.branchId,
      data.deliveryguyId,
      data.deliveryguyName
    );

    const customerData = {
      name: data.name || "",
      phone: data.phone || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      blockHouse: data.blockHouse || "",
      branchId: data.branchId,
      branchName: data.branchName || "",
      createdDate: data.createdDate || "",
      type: "Asbeza",
    };

    console.log(customerData);

    if (data.from === "branch") {
      data.branchId = data.branchId + " normal";
    }

    await createDocument("Asbeza", data, db, batch);
    const Id = generateCustomID(`${data.blockHouse}`);
    await createOrUpdateDocument(db, batch, "customer", Id, customerData);
    data.type = "Asbeza";
    await sendFCMNotification(data);

    // Respond with a success message
    // Commit the batch to execute all operations together
    await batch.commit();
    res
      .status(200)
      .json({ message: "Asbeza Order document created successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = createAsbezaOrder;
