const updateSalaryTable = require("../../credit/updateSalaryTable/updateSalaryTable");
const updateSheetStatus = require("../../credit/updateSheetStatus/updateSheetStatus");
const getDocumentDataById = require("../../utils/getDocumentDataById");

const handleEmployeeBonusChange = async (updatedData, bonusId, db, batch) => {
  if (!bonusId) {
    throw new Error(
      "Unable to update bonus because staff employee information is missing.Please refresh your browser and try again."
    );
  }
  const oldData = await getDocumentDataById("Bonus", bonusId);

  if (updatedData.employeeId !== oldData.employeeId) {
    let collectionNameOld =
      oldData.placement === "DeliveryGuy" ? "salary" : "staffSalary";
    await updateSalaryTable(
      collectionNameOld,
      oldData.active,
      oldData.employeeId,
      "total",
      {
        bonus: -parseInt(oldData.amount),
        total: -parseInt(oldData.amount),
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
        bonus: parseInt(oldData.amount),
        total: parseInt(oldData.amount),
      },
      db,
      batch
    );

    const getDeliveryGuySalary = await getDocumentDataById(
      "salary",
      updatedData.active
    );
    const getStaffSalary = await getDocumentDataById(
      "staffSalary",
      updatedData.active
    );

    // Update sheet status with new SalaryType value
    await updateSheetStatus(
      updatedData.active,
      "totalDeliveryGuySalary",
      getDeliveryGuySalary.total.total,
      db,
      batch
    );
    await updateSheetStatus(
      updatedData.active,
      "totalStaffSalary",
      getStaffSalary.total.total,
      db,
      batch
    );
  }
};

module.exports = handleEmployeeBonusChange;
