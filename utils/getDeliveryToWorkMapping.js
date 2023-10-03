const getDefaultDataObject = require("./createWork");

const getDeliveryToWorkMapping = async (deliveryGuyIds, type = "normal") => {
  const deliveryToWorkMapping = {};
  for (const deliveryGuyId of deliveryGuyIds) {
    const worksDocId = getDefaultDataObject();
    worksDocId.uniqueName = deliveryGuyId.uniqueName;
    worksDocId.name = deliveryGuyId.name;
    if (type === "salary") {
      delete worksDocId.asbezaProfit;
      delete worksDocId.hotelProfit;
      worksDocId.bonus = 0;
      worksDocId.penality = 0;
      worksDocId.fixedSalary = 0;
      worksDocId.holidayBonus = 0;
      worksDocId.totalCredit = 0;
    }
    deliveryToWorkMapping[deliveryGuyId.id] = worksDocId;
  }
  return deliveryToWorkMapping;
};

module.exports = getDeliveryToWorkMapping;
