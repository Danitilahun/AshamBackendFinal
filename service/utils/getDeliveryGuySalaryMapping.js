const getDeliveryGuySalaryData = require("../../util/getDeliveryGuySalaryData");

const getDeliveryGuySalaryMapping = async (deliveryGuyIds) => {
  const deliveryToWorkMapping = {};
  for (const deliveryGuyId of deliveryGuyIds) {
    const worksDocId = getDeliveryGuySalaryData();
    worksDocId.uniqueName = deliveryGuyId.uniqueName;
    worksDocId.name = deliveryGuyId.name;
    deliveryToWorkMapping[deliveryGuyId.id] = worksDocId;
  }
  return deliveryToWorkMapping;
};

module.exports = getDeliveryGuySalaryMapping;
