const admin = require("../../../config/firebase-admin");
const createDocument = require("../../../service/mainCRUD/createDoc");
const createOrUpdateDocument = require("../../../service/order/createOrUpdateDocument");
const generateCustomID = require("../../../util/generateCustomID");
const moveDeliveryGuyToEndOfQueue = require("../../../service/users/deliveryGuyActiveness/moveDeliveryGuyToEndOfQueue");
const createCustomerData = require("../../../util/createCustomerData");

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
    data.status = "Assigned";

    await moveDeliveryGuyToEndOfQueue(
      db,
      batch,
      data.branchKey,
      data.deliveryguyId,
      data.deliveryguyName
    );

    const customerData = createCustomerData(data, "Asbeza");

    const Id = generateCustomID(`${data.blockHouse}`);

    await createOrUpdateDocument(db, batch, "customer", Id, customerData);

    if (data.from === "branch") {
      data.branchId = data.branchId + " normal";
    }

    await createDocument("Asbeza", data, db, batch);

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
