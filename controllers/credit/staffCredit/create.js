const updateDashboard = require("../../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../../service/credit/dashboard/updateDashboardBranchInfo");
const updateSalaryTable = require("../../../service/credit/updateSalaryTable/updateSalaryTable");
const updateSheetStatus = require("../../../service/credit/updateSheetStatus/updateSheetStatus");
const createDocument = require("../../../service/mainCRUD/createDoc");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const admin = require("../../../config/firebase-admin");
const updateCreditDocument = require("../../../service/credit/totalCredit/updateCreditDocument");
const updateCalculator = require("../../../service/credit/updateCalculator/updateCalculator");

const createCredit = async (req, res) => {
  try {
    const data = req.body;

    if (!data || !data.active || !data.branchId || !data.employeeId) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }

    const db = admin.firestore();
    const batch = db.batch();

    // Determine the collection name based on the placement
    const collectionName =
      data.placement === "DeliveryGuy" ? "salary" : "staffSalary";

    // Check if the employee has enough balance for the credit
    const SalaryData = await getDocumentDataById(collectionName, data.active);
    const employeeBalance = SalaryData[data.employeeId]["total"];
    if (parseInt(employeeBalance) < parseInt(data.amount)) {
      // Return an informational response if the balance is insufficient
      return res.status(400).json({
        type: "info",
        message: `This ${data.placement} do not have enough balance to take credit.`,
      });
    }

    await createDocument("StaffCredit", data, db, batch);

    // Update Salary table
    const salaryUpdate = {
      totalCredit: parseInt(data.amount),
    };

    await updateSalaryTable(
      collectionName,
      data.active,
      data.employeeId,
      "total",
      salaryUpdate,
      db,
      batch
    );

    const newTotalCredit = await updateCreditDocument(
      data.branchId,
      "StaffCredit",
      parseFloat(data.amount ? data.amount : 0),
      db,
      batch
    );

    // Update the calculator with the new total credit

    if (newTotalCredit && newTotalCredit?.total) {
      await updateCalculator(data.active, newTotalCredit?.total, db, batch);
    }
    await batch.commit();
    // Respond with a success message
    res.status(200).json({ message: `StaffCredit Created successfully.` });
  } catch (error) {
    console.error(error);
    // Respond with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = createCredit;
