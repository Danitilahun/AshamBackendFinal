const admin = require("../../../config/firebase-admin");

const removeFromDeliveryQueue = async (db, batch, branchId, deliveryManId) => {
  try {
    const docRef = db.collection("Deliveryturn").doc("turnQueue");

    const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      const existingData = docSnapshot.data();
      const existingQueue = existingData[branchId] || [];

      const updatedQueue = existingQueue.filter(
        (item) => item.deliveryManId !== deliveryManId
      );

      batch.update(docRef, { [branchId]: updatedQueue });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = removeFromDeliveryQueue;
