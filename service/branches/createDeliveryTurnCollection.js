const createDeliveryTurnCollection = async (db, batch) => {
  try {
    const deliveryTurnCollectionRef = db.collection("Deliveryturn");
    const deliveryTurnCollectionSnapshot =
      await deliveryTurnCollectionRef.get();

    if (deliveryTurnCollectionSnapshot.empty) {
      // Create initial data for the delivery turn collection
      const initialData = {};

      // Add the operation to the batch
      batch.set(deliveryTurnCollectionRef.doc("turnQueue"), initialData);
    }
  } catch (error) {
    console.error("Error in createDeliveryTurnCollection:", error);
    throw error;
  }
};

module.exports = createDeliveryTurnCollection;
