// Import required modules
const express = require("express");
const router = express.Router();
const deliveryGuyController = require("../controllers/deliveryguy");
const setActivenss = require("../controllers/createDeliveryTurnCollection");
const authMiddleware = require("../middlewares/adminAuth");
const handleSalaryPay = require("../controllers/users/deliveryGuy/handleSalaryPay");

// Define the route for creating data for a delivery guy
router.post("/", authMiddleware, deliveryGuyController.createDeliveryGuyData);

// Define the route for updating data for a delivery guy
router.put("/:id", authMiddleware, deliveryGuyController.updateDeliveryGuyData);
router.put("/pay/:id/:active", authMiddleware, handleSalaryPay);

router.post(
  "/setactiveness",
  authMiddleware,
  setActivenss.handleDeliveryRequest
);

router.put(
  "/profileImage/:id",
  authMiddleware,
  deliveryGuyController.updateProfilePicture
);
// Define the route for deleting data for a delivery guy
router.delete(
  "/:id/:branchId",
  authMiddleware,
  deliveryGuyController.deleteDeliveryGuyData
);

// Export the router
module.exports = router;

// const admin = require("../../../config/firebase-admin");
// const getDocumentById = require("../../../utils/getDocumentById");
// const getSingleDocFromCollection = require("../../../utils/getSingleDocFromCollection");
// const updateBalance = require("../../../utils/updateBalance");
// const updateCreditDocument = require("../../../utils/updateCreditDocument");
// const updateDataForId = require("../../../utils/updateDataForId");
// const updateFieldInDocument = require("../../../utils/updateFieldInDocument");

// db = admin.firestore();
// // Function to create the "Deliveryturn" collection if it doesn't exist

// // Arrow function to handle the incoming request and process the data
// const handleSalaryPay = async (req, res) => {
//   const { id, active } = req.params;
//   try {
//     // Ensure "Deliveryturn" collection exists

//     const deliveryGuyRef = db.collection("deliveryguy").doc(id);
//     const deliveryGuySnapshot = await deliveryGuyRef.get();
//     if (deliveryGuySnapshot.exists) {
//       // If activeness field exists, update its value with the provided active value
//       if (deliveryGuySnapshot.data().dailyCredit > 0) {
//         const creditCollection = db.collection("StaffCredit"); // Assuming you have a "credits" collection
//         const data = {
//           name: deliveryGuySnapshot.data().fullName,
//           deliveryguyId: id,
//           placement: "DeliveryGuy",
//           deliveryguyName: deliveryGuySnapshot.data().fullName,
//           amount: parseInt(deliveryGuySnapshot.data().dailyCredit),
//           branchId: deliveryGuySnapshot.data().branch,
//           createdAt: admin.firestore.FieldValue.serverTimestamp(),
//           date: new Date(),
//           type: "StaffCredit",
//           reason: "Do not complete the daily credit return.",
//           active: active,
//         };

//         data.openingDate = new Date();

//         data.createdAt = admin.firestore.FieldValue.serverTimestamp();

//         await creditCollection.add(data);

//         await updateCreditDocument(
//           deliveryGuySnapshot.data().branch,
//           "StaffCredit",
//           parseInt(data.amount)
//         );

//         const totalCredit = await getDocumentById("totalCredit", data.branchId);

//         const Credits = totalCredit["total"];

//         await updateBalance(data.active, parseInt(Credits), "credit");

//         await updateFieldInDocument(
//           "Budget",
//           deliveryGuySnapshot.data().branch,
//           "totalCredit",
//           parseFloat(Credits)
//         );
//       }
//       await deliveryGuyRef.update({
//         activeness: false,
//         paid: true,
//         waiting: false,
//         dailyCredit: 0,
//       });
//     }

//     const Price = await getSingleDocFromCollection("prices");
//     const salaryData = {
//       fixedSalary: Price["fixedSalary"],
//       total: Price["fixedSalary"],
//     };

//     await updateDataForId(
//       "salary",
//       active,
//       id,
//       salaryData,
//       "total",
//       salaryData
//     );

//     return res.status(200).json({ message: "Data successfully updated." });
//   } catch (error) {
//     console.error("Error handling request:", error);
//     return res.status(500).json({ error: "Something went wrong." });
//   }
// };

// module.exports = handleSalaryPay;
