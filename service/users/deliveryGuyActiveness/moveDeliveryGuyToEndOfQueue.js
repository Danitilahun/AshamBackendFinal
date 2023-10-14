const moveDeliveryGuyToEndOfQueue = async (
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
    const itemIndex = existingQueue.findIndex(
      (item) => item.deliveryManId === deliveryManId
    );

    if (itemIndex !== -1) {
      // Remove the item from its current position
      const [movedItem] = existingQueue.splice(itemIndex, 1);

      // Push the item to the end of the queue
      existingQueue.push(movedItem);

      batch.update(docRef, { [branchId]: existingQueue });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = moveDeliveryGuyToEndOfQueue;
