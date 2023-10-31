const admin = require("../../config/firebase-admin");

const getAllStaffByBranchId = async (collectionName, branchId) => {
  if (!branchId || !collectionName) {
    return null;
  }

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
        salary: data.paid ? data.salary : 0,
        uniqueName: data.uniqueName,
        bankAccount: data.bankAccount,
      };
      deliveryGuys.push(deliveryGuy);
    });

    return deliveryGuys;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = getAllStaffByBranchId;
