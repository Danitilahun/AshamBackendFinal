const updateSalaryTable = require("../../credit/updateSalaryTable/updateSalaryTable");
const updateSheetStatus = require("../../credit/updateSheetStatus/updateSheetStatus");
const getDocumentDataById = require("../../utils/getDocumentDataById");

const handleEmployeePenalityChange = async (
  updatedData,
  penalityId,
  db,
  batch
) => {
  const oldData = await getDocumentDataById("Penality", penalityId);

  if (updatedData.employeeId !== oldData.employeeId) {
    let collectionNameOld =
      oldData.placement === "DeliveryGuy" ? "salary" : "staffSalary";
    const newSalary1 = await updateSalaryTable(
      collectionNameOld,
      oldData.active,
      oldData.employeeId,
      "total",
      {
        penality: -parseInt(oldData.amount),
        total: parseInt(oldData.amount),
      },
      db,
      batch
    );

    let collectionNameNew =
      updatedData.placement === "DeliveryGuy" ? "salary" : "staffSalary";

    const newSalary2 = await updateSalaryTable(
      collectionNameNew,
      updatedData.active,
      updatedData.employeeId,
      "total",
      {
        penality: parseInt(oldData.amount),
        total: -parseInt(oldData.amount),
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

    const newDG =
      getDeliveryGuySalary.total.total +
      (oldData.placement === "DeliveryGuy" ? parseInt(oldData.amount) : 0) -
      (updatedData.placement === "DeliveryGuy" ? parseInt(oldData.amount) : 0);
    const newSF =
      getStaffSalary.total.total +
      (oldData.placement === "DeliveryGuy" ? 0 : parseInt(oldData.amount)) -
      (updatedData.placement === "DeliveryGuy" ? 0 : parseInt(oldData.amount));
    // Update sheet status with new SalaryType value
    await updateSheetStatus(
      updatedData.active,
      "totalDeliveryGuySalary",
      newDG,
      db,
      batch
    );
    await updateSheetStatus(
      updatedData.active,
      "totalStaffSalary",
      newSF,
      db,
      batch
    );
  }
};

module.exports = handleEmployeePenalityChange;
