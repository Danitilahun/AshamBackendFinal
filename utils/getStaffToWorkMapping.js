const getStaffToWorkMapping = async (deliveryGuyIds) => {
  const deliveryToWorkMapping = {};
  let total = 0;
  for (const deliveryGuyId of deliveryGuyIds) {
    const worksDocId = {};
    worksDocId.uniqueName = deliveryGuyId.uniqueName;
    worksDocId.name = deliveryGuyId.name;
    worksDocId.bonus = 0;
    worksDocId.penality = 0;
    worksDocId.fixedSalary = 0;
    worksDocId.holidayBonus = 0;
    worksDocId.totalCredit = 0;

    worksDocId.total = 0;
    if (deliveryGuyId.name !== "total") {
      worksDocId.fixedSalary = parseInt(deliveryGuyId.salary);
      worksDocId.total = parseInt(deliveryGuyId.salary);
      total += parseInt(deliveryGuyId.salary);
    }
    deliveryToWorkMapping[deliveryGuyId.id] = worksDocId;
  }
  deliveryToWorkMapping.total.total = total;
  deliveryToWorkMapping.total.fixedSalary = total;

  return deliveryToWorkMapping;
};

module.exports = getStaffToWorkMapping;
