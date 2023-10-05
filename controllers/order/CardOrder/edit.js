const editDocument = require("../../../service/mainCRUD/editDoc");
const createOrUpdateDocument = require("../../../service/order/createOrUpdateDocument");
const sendFCMNotification = require("../../../service/order/sendFCMNotification");
const generateCustomID = require("../../../util/generateCustomID");
const admin = require("../../../config/firebase-admin");
const getSingleDocFromCollection = require("../../../service/utils/getSingleDocFromCollection");

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

    if (!updatedData || !id) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }
    const companyGain = await getSingleDocFromCollection("companyGain"); // Updated function call
    console.log(companyGain);
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
    const customerData = {
      name: updatedData.name,
      phone: updatedData.phone,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      blockHouse: updatedData.blockHouse,
      branchId: updatedData.branchId,
      branchName: updatedData.branchName,
      createdDate: updatedData.createdDate,
      type: "Card",
    };

    const Id = generateCustomID(`${updatedData.blockHouse}`);
    await createOrUpdateDocument(db, batch, "customer", Id, customerData); // Updated function call
    // Respond with a success message
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
