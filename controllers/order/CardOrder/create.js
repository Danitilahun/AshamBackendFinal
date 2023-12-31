const admin = require("../../../config/firebase-admin");
const createDocument = require("../../../service/mainCRUD/createDoc");
const createOrUpdateDocument = require("../../../service/order/createOrUpdateDocument");
const generateCustomID = require("../../../util/generateCustomID");
const getSingleDocFromCollection = require("../../../service/utils/getSingleDocFromCollection");
const moveDeliveryGuyToEndOfQueue = require("../../../service/users/deliveryGuyActiveness/moveDeliveryGuyToEndOfQueue");
const createCustomerData = require("../../../util/createCustomerData");

/**
 * Create a Card Order document in the "CardOrder" Firestore collection.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */

const createCardOrder = async (req, res) => {
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

    const customerData = createCustomerData(data, "Card");

    const Id = generateCustomID(`${data.blockHouse}`);

    await createOrUpdateDocument(db, batch, "customer", Id, customerData);

    if (data.from === "branch") {
      data.branchId = data.branchId + " normal";
    }

    const companyGain = await getSingleDocFromCollection("companyGain");

    if (!companyGain) {
      return res.status(400).json({
        message:
          "You can't create order since there is no company gain information.",
      });
    }

    data.dayRemain = parseInt(
      data.amountBirr / parseInt(companyGain.card_price)
    );
    data.remaingMoney = parseInt(data.amountBirr);

    await createDocument("Card", data, db, batch);

    // Commit the batch to execute all operations together
    await batch.commit();
    res
      .status(200)
      .json({ message: "Card Order document created successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = createCardOrder;
