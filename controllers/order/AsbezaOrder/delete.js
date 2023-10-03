// const deleteDocument = require("../../../service/mainCRUD/deleteDoc");
// const updateDashboardTotalCustomer = require("../../../service/order/updateDashboardTotalCustomer");
// const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const updateFieldInDocument = require("../../../service/utils/updateFieldInDocument");
// const generateCustomID = require("../../../util/generateCustomID");

// /**
//  * Delete an Asbeza Order document from the "Asbeza Order" Firestore collection.
//  *
//  * @param {Object} req - The Express request object.
//  * @param {Object} res - The Express response object.
//  * @returns {void}
//  */
// const deleteAsbezaOrder = async (req, res) => {
//   try {
//     // Get document ID from the request parameters
//     const { id } = req.params;
//     const AsbezaData = await getDocumentDataById("Asbeza", id);
//     // Delete the Asbeza Order document from the "Asbeza Order" collection
//     await deleteDocument("Asbeza", id);
//     const Id = generateCustomID(`${AsbezaData.blockHouse}`);
//     await updateFieldInDocument("customer", Id, "Asbeza", "No");
//     // await updateDashboardTotalCustomer(-1);
//     // Respond with a success message
//     res
//       .status(200)
//       .json({ message: "Asbeza Order document deleted successfully." });
//   } catch (error) {
//     // Handle any errors that occur during the operation
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = deleteAsbezaOrder;

const admin = require("../../../config/firebase-admin");
const deleteDocument = require("../../../service/mainCRUD/deleteDoc");
const updateDashboardTotalCustomer = require("../../../service/order/updateDashboardTotalCustomer");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const generateCustomID = require("../../../util/generateCustomID");

/**
 * Delete an Asbeza Order document from the "Asbeza Order" Firestore collection.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
const deleteAsbezaOrder = async (req, res) => {
  try {
    const db = admin.firestore(); // Create a Firestore database instance
    const batch = db.batch(); // Create a Firestore batch instance

    // Get document ID from the request parameters
    const { id } = req.params;
    const AsbezaData = await getDocumentDataById("Asbeza", id); // Updated function call

    // Delete the Asbeza Order document from the "Asbeza Order" collection
    await deleteDocument(db, batch, "Asbeza", id); // Updated function call
    const Id = generateCustomID(`${AsbezaData.blockHouse}`);
    await updateFieldInDocument(db, batch, "customer", Id, "Asbeza", "No"); // Updated function call
    await batch.commit();
    // Respond with a success message
    res
      .status(200)
      .json({ message: "Asbeza Order document deleted successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteAsbezaOrder;
