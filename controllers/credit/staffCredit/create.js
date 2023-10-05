const updateDashboard = require("../../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../../service/credit/dashboard/updateDashboardBranchInfo");
const updateSalaryTable = require("../../../service/credit/updateSalaryTable/updateSalaryTable");
const updateSheetStatus = require("../../../service/credit/updateSheetStatus/updateSheetStatus");
const createDocument = require("../../../service/mainCRUD/createDoc");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const admin = require("../../../config/firebase-admin");

const createCredit = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    if (!data) {
      return res
        .status(400)
        .json({
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
      total: -parseInt(data.amount),
    };
    const newSalaryTable = await updateSalaryTable(
      collectionName,
      data.active,
      data.employeeId,
      "total",
      salaryUpdate,
      db,
      batch
    );

    console.log("newSalaryTable", newSalaryTable.total.total);
    // console.log(man);
    // Determine the SalaryType based on placement
    const SalaryType =
      data.placement === "DeliveryGuy"
        ? "totalDeliveryGuySalary"
        : "totalStaffSalary";
    if (newSalaryTable) {
      // Update sheet status with new SalaryType value
      const newStatus = await updateSheetStatus(
        data.active,
        SalaryType,
        newSalaryTable.total.total - parseInt(data.amount),
        db,
        batch
      );

      console.log("newStatus", newStatus);
      // console.log(man);
      if (newStatus) {
        // Update the dashboard with the new status
        await updateDashboard(db, batch, data.branchId, newStatus.totalExpense);

        // Update dashboard branch info with the new status
        await updateDashboardBranchInfo(
          db,
          batch,
          data.branchId,
          newStatus.totalExpense
        );
      }
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
