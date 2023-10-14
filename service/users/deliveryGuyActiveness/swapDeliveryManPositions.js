const admin = require("../../../config/firebase-admin");

const swapDeliveryManPositions = async (
  branchId,
  deliveryManId1,
  deliveryManId2
) => {
  try {
    const db = admin.firestore();
    const docRef = db.collection("Deliveryturn").doc("turnQueue");

    await db.runTransaction(async (transaction) => {
      const docSnapshot = await transaction.get(docRef);

      if (!docSnapshot.exists) {
        // If the document doesn't exist, there's nothing to swap.
        return;
      }

      const existingData = docSnapshot.data();
      const existingQueue = existingData[branchId] || [];

      // Find the indices of the items to swap
      let index1 = -1;
      let index2 = -1;

      for (let i = 0; i < existingQueue.length; i++) {
        if (existingQueue[i].deliveryManId === deliveryManId1) {
          index1 = i;
        } else if (existingQueue[i].deliveryManId === deliveryManId2) {
          index2 = i;
        }

        // Break the loop if both indices are found
        if (index1 !== -1 && index2 !== -1) {
          break;
        }
      }

      // Check if both items were found
      if (index1 !== -1 && index2 !== -1) {
        // Swap the items
        const temp = existingQueue[index1];
        existingQueue[index1] = existingQueue[index2];
        existingQueue[index2] = temp;
        // Update the queue in Firestore
        transaction.update(docRef, { [branchId]: existingQueue });
      }
    });
  } catch (error) {
    throw error;
  }
};

module.exports = swapDeliveryManPositions;
