// createDeliveryTurnCollection.js

// const admin = require("../../config/firebase-admin");

// /**
//  * Create a DeliveryTurn collection if it's empty.
//  * @returns {Promise<void>} A Promise that resolves when the operation is complete.
//  */
// const createDeliveryTurnCollection = async () => {
//   const db = admin.firestore();
//   const deliveryTurnCollectionRef = db.collection("Deliveryturn");
//   const deliveryTurnCollectionSnapshot = await deliveryTurnCollectionRef.get();

//   if (deliveryTurnCollectionSnapshot.empty) {
//     return deliveryTurnCollectionRef.doc("turnQueue").set({});
//   }
// };

// module.exports = createDeliveryTurnCollection;

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
