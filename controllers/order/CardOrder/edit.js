const admin = require("../../../config/firebase-admin");
const editDocument = require("../../../service/mainCRUD/editDoc");
const createOrUpdateDocument = require("../../../service/order/createOrUpdateDocument");
const generateCustomID = require("../../../util/generateCustomID");
const getSingleDocFromCollection = require("../../../service/utils/getSingleDocFromCollection");
const createCustomerData = require("../../../util/createCustomerData");

/**
 * Edit a Card Order document in the "CardOrder" Firestore collection.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */

const editCardOrder = async (req, res) => {
  const db = admin.firestore();
  const batch = db.batch(); // Create a Firestore batch

  try {
    // Get document ID and updated data from the request body
    const updatedData = req.body;
    const { id } = req.params;

    updatedData.status = "Assigned";

    updatedData.createdAt = admin.firestore.FieldValue.serverTimestamp();
    const companyGain = await getSingleDocFromCollection("companyGain"); // Updated function call

    if (!companyGain) {
      return res.status(400).json({
        message: "Company Gain document is missing or empty",
      });
    }

    updatedData.dayRemain = parseInt(
      updatedData.amountBirr / parseInt(companyGain.card_price)
    );

    updatedData.remaingMoney = parseInt(updatedData.amountBirr);

    // Edit the Card Order document in the "CardOrder" collection
    await editDocument(db, batch, "Card", id, updatedData); // Updated function call

    const customerData = createCustomerData(updatedData, "Card");

    const Id = generateCustomID(`${updatedData.blockHouse}`);

    await createOrUpdateDocument(db, batch, "customer", Id, customerData); // Updated function call

    // Commit the batch to execute all operations together
    await batch.commit();
    res
      .status(200)
      .json({ message: "Card Order document edited successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = editCardOrder;
