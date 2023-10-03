// const admin = require("../../../config/firebase-admin");

const addToDeliveryQueue = async (
  db,
  batch,
  branchId,
  deliveryManId,
  deliveryGuyName
) => {
  try {
    if (!branchId || !deliveryManId) {
      return;
    }
    const docRef = db.collection("Deliveryturn").doc("turnQueue");

    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      const newDocData = {
        [branchId]: [
          { deliveryManId: deliveryManId, deliveryGuyName: deliveryGuyName },
        ],
      };
      batch.set(docRef, newDocData);
      return;
    }

    const existingData = docSnapshot.data();
    const existingQueue = existingData[branchId] || [];

    // Check if an item with the same deliveryManId exists
    const itemExists = existingQueue.some(
      (item) => item.deliveryManId === deliveryManId
    );

    if (!itemExists) {
      existingQueue.push({
        deliveryManId: deliveryManId,
        deliveryGuyName: deliveryGuyName,
      });

      batch.update(docRef, { [branchId]: existingQueue });
    }
  } catch (error) {
    throw new Error(`Error adding to delivery queue: ${error.message}`);
  }
};

module.exports = addToDeliveryQueue;
