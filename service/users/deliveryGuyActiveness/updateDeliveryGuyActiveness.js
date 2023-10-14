// const admin = require("../../../config/firebase-admin");

// const updateDeliveryGuyActiveness = async (deliveryManId, active) => {
//   try {
//     const db = admin.firestore();
//     const deliveryGuyRef = db.collection("deliveryguy").doc(deliveryManId);

//     const deliveryGuySnapshot = await deliveryGuyRef.get();

//     if (deliveryGuySnapshot.exists) {
//       const waiting = deliveryGuySnapshot.data().waiting;
//       if (waiting) {
//         await deliveryGuyRef.update({ activeness: active });
//       } else {
//         await deliveryGuyRef.update({
//           activeness: active,
//           paid: false,
//           waiting: true,
//         });
//       }
//     }
//   } catch (error) {
//     throw new Error(`Error updating delivery guy activeness: ${error.message}`);
//   }
// };

// module.exports = updateDeliveryGuyActiveness;

const admin = require("../../../config/firebase-admin");

/**
 * Update the activeness of a delivery guy with batch support.
 *
 * @param {string} deliveryManId - ID of the delivery guy.
 * @param {boolean} active - Active status.
 * @param {Firestore} db - Firestore database instance.
 * @param {WriteBatch} batch - Firestore batch instance.
 * @returns {Promise<void>} A Promise that resolves once the update is completed.
 * @throws {Error} Throws an error if there's an issue with the operation.
 */
const updateDeliveryGuyActiveness = async (
  deliveryManId,
  active,
  db,
  batch
) => {
  try {
    const deliveryGuyRef = db.collection("deliveryguy").doc(deliveryManId);

    const deliveryGuySnapshot = await deliveryGuyRef.get();

    if (deliveryGuySnapshot.exists) {
      const waiting = deliveryGuySnapshot.data().waiting;

      if (waiting) {
        // Update activeness field with batch
        batch.update(deliveryGuyRef, { activeness: active });
      } else {
        // Update multiple fields with batch
        batch.update(deliveryGuyRef, {
          activeness: active,
          paid: false,
          waiting: true,
        });
      }
    }
  } catch (error) {
    throw error;
  }
};

module.exports = updateDeliveryGuyActiveness;
