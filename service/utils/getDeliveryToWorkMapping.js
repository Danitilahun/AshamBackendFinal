const getDeliveryGuyWorkData = require("../../util/getDeliveryGuyWorkData");

const getDeliveryToWorkMapping = async (deliveryGuyIds) => {
  const deliveryToWorkMapping = {};
  for (const deliveryGuyId of deliveryGuyIds) {
    const worksDocId = getDeliveryGuyWorkData();
    worksDocId.uniqueName = deliveryGuyId.uniqueName;
    worksDocId.name = deliveryGuyId.name;
    deliveryToWorkMapping[deliveryGuyId.id] = worksDocId;
  }
  return deliveryToWorkMapping;
};

module.exports = getDeliveryToWorkMapping;
