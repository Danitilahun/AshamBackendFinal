// // Importing necessary services and utilities
// const updateCreditDocument = require("../../service/credit/totalCredit/updateCreditDocument");
// const updateCalculator = require("../../service/credit/updateCalculator/updateCalculator");
// const updateDeliveryGuy = require("../../service/credit/updateDeliveryGuy/updateDeliveryGuy");
// const createDocument = require("../../service/mainCRUD/createDoc");
// const createDocumentWithCustomId = require("../../service/mainCRUD/createDocumentWithCustomId");
// const updateSheetStatus = require("../../service/utils/updateSheetStatus");
// const getSingleDocFromCollection = require("../../service/utils/getSingleDocFromCollection");
// const updateTable = require("../../service/utils/updateTable");
// const updateDashboard = require("../../service/credit/dashboard/updateDashboard");
// const updateDashboardBranchInfo = require("../../service/credit/dashboard/updateDashboardBranchInfo");
// const generateCustomID = require("../../utils/generateCustomID");

// /**
//  * Handles the creation of a CardFee report and related operations.
//  * @param {Object} req - Express.js request object containing the credit data in the body.
//  * @param {Object} res - Express.js response object.
//  * @returns {Object} JSON response indicating success or failure.
//  */

// const CardDistrubuteReport = async (req, res) => {
//   try {
//     // Extracting data from the request body and adding a timestamp
//     const data = req.body;
//     // Logging the received data
//     const companyGain = await getSingleDocFromCollection("companyGain");

//     console.log(data);
//     data.amount = parseInt(
//       data.numberOfCard * companyGain.card_distribute_gain
//     );
//     data.reason = "cardDistribute";
//     data.CHECK_SOURCE = generateCustomID("cardDistribute_Report_Reason");
//     data.source = "Report";
//     // Creating a new credit document in the "CardFee" collection
//     const id = await createDocument("cardDistribute", data);
//     await createDocumentWithCustomId("DailyCredit", id, data);
//     // Update the total credit and retrieve the updated total
//     await updateDeliveryGuy(
//       data.deliveryguyId,
//       "dailyCredit",
//       parseInt(data.numberOfCard * companyGain.card_distribute_gain)
//     );
//     // // Updating various tables with cardFee information

//     const DeliveryGuyGain = await getSingleDocFromCollection("prices");

//     // // Fourth update: Salary of the delivery guy table
//     const newSalaryExpense = await updateTable(
//       "salary",
//       data.active,
//       data.deliveryguyId,
//       "total",
//       {
//         cardDistribute:
//           data.numberOfCard * DeliveryGuyGain.card_distribute_price,
//         total: data.numberOfCard * DeliveryGuyGain.card_distribute_price,
//       }
//     );

//     // // Updating sheet status with totalDeliveryGuySalary
//     const newStatus = await updateSheetStatus(
//       data.active,
//       "totalDeliveryGuySalary",
//       newSalaryExpense.total.total
//     );

//     await updateDashboard(data.branchId, newStatus.totalExpense);

//     // Update dashboard branch info with the new status
//     await updateDashboardBranchInfo(data.branchId, newStatus.totalExpense);
//     // await updateSheetStatus(data.active, "totalIncome", newIncome.total.total);

//     // Calling createCredit function to handle credit document creation

//     // Responding with a success message

//     res
//       .status(200)
//       .json({ message: `Card Distribute Report Created successfully.` });
//   } catch (error) {
//     // Handling and logging any errors
//     console.error(error);

//     // Responding with an error message
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = CardDistrubuteReport;

const updateCreditDocument = require("../../service/credit/totalCredit/updateCreditDocument");
const updateCalculator = require("../../service/credit/updateCalculator/updateCalculator");
const updateDeliveryGuy = require("../../service/credit/updateDeliveryGuy/updateDeliveryGuy");
const createDocument = require("../../service/mainCRUD/createDoc");
const createDocumentWithCustomId = require("../../service/mainCRUD/createDocumentWithCustomId");
const updateSheetStatus = require("../../service/utils/updateSheetStatus");
const getSingleDocFromCollection = require("../../service/utils/getSingleDocFromCollection");
const updateTable = require("../../service/utils/updateTable");
const updateDashboard = require("../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../service/credit/dashboard/updateDashboardBranchInfo");
const generateCustomID = require("../../utils/generateCustomID");
const admin = require("../../config/firebase-admin"); // Import admin here
const getDocumentDataById = require("../../service/utils/getDocumentDataById");

/**
 * Handles the creation of a CardFee report and related operations.
 * @param {Object} req - Express.js request object containing the credit data in the body.
 * @param {Object} res - Express.js response object.
 * @returns {Object} JSON response indicating success or failure.
 */

const CardDistrubuteReport = async (req, res) => {
  try {
    // Create Firestore database and batch from admin
    const db = admin.firestore();
    const batch = db.batch();

    // Extracting data from the request body and adding a timestamp
    const data = req.body;
    // Logging the received data
    const companyGain = await getSingleDocFromCollection("companyGain");

    console.log(data);
    console.log(companyGain);
    data.amount = parseInt(
      data.numberOfCard * companyGain.card_distribute_gain
    );
    data.reason = "cardDistribute";
    data.CHECK_SOURCE = generateCustomID("cardDistribute_Report_Reason");
    data.source = "Report";
    // Creating a new credit document in the "CardFee" collection
    const id = await createDocument("cardDistribute", data, db, batch);
    await createDocumentWithCustomId("DailyCredit", id, data, db, batch);
    // Update the total credit and retrieve the updated total
    await updateDeliveryGuy(
      db,
      batch,
      data.deliveryguyId,
      "dailyCredit",
      parseInt(data.numberOfCard * companyGain.card_distribute_gain)
    );
    // Updating various tables with cardFee information

    const DeliveryGuyGain = await getSingleDocFromCollection("prices");

    // Fourth update: Salary of the delivery guy table
    const newSalaryExpense = await updateTable(
      db,
      "salary",
      data.active,
      data.deliveryguyId,
      "total",
      {
        cardDistribute:
          data.numberOfCard * DeliveryGuyGain.card_distribute_price,
        total: data.numberOfCard * DeliveryGuyGain.card_distribute_price,
      },
      batch
    );

    // Updating sheet status with totalDeliveryGuySalary
    const newStatus = await updateSheetStatus(
      db,
      batch,
      data.active,
      "totalDeliveryGuySalary",
      newSalaryExpense.total.total +
        data.numberOfCard * DeliveryGuyGain.card_distribute_price
    );

    if (newStatus) {
      await updateDashboard(db, batch, data.branchId, newStatus.totalExpense);

      // Update dashboard branch info with the new status
      await updateDashboardBranchInfo(
        db,
        batch,
        data.branchId,
        newStatus.totalExpense
      );
    }

    // Commit the batch updates
    await batch.commit();

    // Responding with a success message
    res
      .status(200)
      .json({ message: `Card Distribute Report Created successfully.` });
  } catch (error) {
    // Handling and logging any errors
    console.error(error);

    // Responding with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = CardDistrubuteReport;