const admin = require("../../config/firebase-admin");

const getAllDeliveryGuysByBranchId = async (collectionName, branchId) => {
  try {
    const deliveryGuysSnapshot = await admin
      .firestore()
      .collection(collectionName)
      .where("branchId", "==", branchId)
      .get();

    const deliveryGuys = [];
    deliveryGuysSnapshot.forEach((doc) => {
      const data = doc.data();
      const deliveryGuy = {
        id: doc.id,
        name: data.fullName,
        uniqueName: data.uniqueName,
        activeness: data.activeness,
      };
      deliveryGuys.push(deliveryGuy);
    });

    return deliveryGuys;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while retrieving delivery guys.");
  }
};

module.exports = getAllDeliveryGuysByBranchId;
