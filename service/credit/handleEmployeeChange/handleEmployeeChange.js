const getDocumentDataById = require("../../utils/getDocumentDataById");
const updateSalaryTable = require("../updateSalaryTable/updateSalaryTable");

const handleEmployeeChange = async (updatedData, creditId, db, batch) => {
  const oldData = await getDocumentDataById("StaffCredit", creditId);

  if (updatedData.employeeId !== oldData.employeeId) {
    const collectionName =
      updatedData.placement === "DeliveryGuy" ? "salary" : "staffSalary";
    // Check if the employee has enough balance for the credit
    const SalaryData = await getDocumentDataById(
      collectionName,
      updatedData.active
    );
    const employeeBalance = SalaryData[updatedData.employeeId]["total"];
    if (parseInt(employeeBalance) < parseInt(updatedData.amount)) {
      // Return an informational response if the balance is insufficient
      return false;
    }

    let collectionNameOld =
      oldData.placement === "DeliveryGuy" ? "salary" : "staffSalary";
    await updateSalaryTable(
      collectionNameOld,
      oldData.active,
      oldData.employeeId,
      "total",
      {
        totalCredit: -parseInt(oldData.amount),
        total: parseInt(oldData.amount),
      },
      db,
      batch
    );

    let collectionNameNew =
      updatedData.placement === "DeliveryGuy" ? "salary" : "staffSalary";

    await updateSalaryTable(
      collectionNameNew,
      updatedData.active,
      updatedData.employeeId,
      "total",
      {
        totalCredit: parseInt(oldData.amount),
        total: -parseInt(oldData.amount),
      },
      db,
      batch
    );
  }
  return true;
};

module.exports = handleEmployeeChange;
