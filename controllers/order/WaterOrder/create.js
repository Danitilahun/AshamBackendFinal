const admin = require("../../../config/firebase-admin");
const createDocument = require("../../../service/mainCRUD/createDoc");
const createOrUpdateDocument = require("../../../service/order/createOrUpdateDocument");
const generateCustomID = require("../../../util/generateCustomID");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const moveDeliveryGuyToEndOfQueue = require("../../../service/users/deliveryGuyActiveness/moveDeliveryGuyToEndOfQueue");
const documentExistsAndHasField = require("../../../service/utils/documentExistsAndHasField");
const createCustomerData = require("../../../util/createCustomerData");

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
    data.status = "Assigned";

    await moveDeliveryGuyToEndOfQueue(
      db,
      batch,
      data.branchKey,
      data.deliveryguyId,
      data.deliveryguyName
    ); // Updated function call

    const customerData = createCustomerData(data, "Water");

    const Id = generateCustomID(`${data.blockHouse}`);

    await createOrUpdateDocument(db, batch, "customer", Id, customerData); // Updated function call

    if (data.from === "branch") {
      data.branchId = data.branchId + " normal";
    }

    await createDocument("Water", data, db, batch); // Updated function call

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
