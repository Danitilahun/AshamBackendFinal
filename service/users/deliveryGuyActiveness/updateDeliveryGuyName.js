// const admin = require("../../../config/firebase-admin");
// const updateDeliveryGuyName = async (
//   branchId,
//   deliveryManId,
//   newDeliveryGuyName
// ) => {
//   try {
//     const db = admin.firestore();
//     const docRef = db.collection("Deliveryturn").doc("turnQueue");

//     await db.runTransaction(async (transaction) => {
//       const docSnapshot = await transaction.get(docRef);

//       if (docSnapshot.exists) {
//         const existingData = docSnapshot.data();
//         const existingQueue = existingData[branchId] || [];

//         for (const item of existingQueue) {
//           if (item.deliveryManId === deliveryManId) {
//             item.deliveryGuyName = newDeliveryGuyName;
//           }
//         }

//         transaction.update(docRef, { [branchId]: existingQueue });
//       }
//     });
//   } catch (error) {
//     throw new Error(`Error updating delivery guy name: ${error.message}`);
//   }
// };

// module.exports = updateDeliveryGuyName;

/**
 * Update the delivery guy's name in the "Deliveryturn" Firestore document with batch update support.
 *
 * @param {string} branchId - The branch ID.
 * @param {string} deliveryManId - The delivery man's ID.
 * @param {string} newDeliveryGuyName - The new name for the delivery guy.
 * @param {Firestore} db - Firestore database instance.
 * @param {WriteBatch} batch - Firestore batch instance.
 * @returns {Promise<void>} A Promise that resolves once the update is completed.
 * @throws {Error} Throws an error if there's an issue with the operation.
 */
const updateDeliveryGuyName = async (
  branchId,
  deliveryManId,
  newDeliveryGuyName,
  db,
  batch
) => {
  try {
    const docRef = db.collection("Deliveryturn").doc("turnQueue");
    const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      const existingData = docSnapshot.data();
      const existingQueue = existingData[branchId] || [];

      for (const item of existingQueue) {
        if (item.deliveryManId === deliveryManId) {
          item.deliveryGuyName = newDeliveryGuyName;
        }
      }

      // Update the document with the modified queue using the batch
      batch.update(docRef, { [branchId]: existingQueue });
    }
  } catch (error) {
    throw new Error(`Error updating delivery guy name: ${error.message}`);
  }
};

module.exports = updateDeliveryGuyName;
