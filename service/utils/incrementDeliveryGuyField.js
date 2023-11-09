const admin = require("firebase-admin");

const incrementDeliveryGuyField = (db, deliveryGuyId, fieldName, batch) => {
  try {
    const deliveryGuyRef = db.collection("deliveryguy").doc(deliveryGuyId);

    // Increment the specified field by 1
    const updateData = {};
    updateData[fieldName] = admin.firestore.FieldValue.increment(1);

    batch.update(deliveryGuyRef, updateData);
    console.log(
      `${fieldName} for Delivery Guy ${deliveryGuyId} updated successfully.`
    );
  } catch (error) {
    console.error(
      `Error updating ${fieldName} for Delivery Guy ${deliveryGuyId}:`,
      error
    );
    throw error;
  }
};

module.exports = incrementDeliveryGuyField;
