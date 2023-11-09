const updateDeliveryGuys = async (db, branchId, batch) => {
  try {
    // Query the delivery guys collection based on the branchId
    const deliveryGuysRef = db
      .collection("deliveryguy")
      .where("branchId", "==", branchId);
    const querySnapshot = await deliveryGuysRef.get();

    querySnapshot.forEach(async (doc) => {
      const deliveryGuyRef = db.collection("deliveryguy").doc(doc.id);
      batch.update(deliveryGuyRef, {
        AsbezaDeleted: 0,
        CardDeleted: 0,
        WaterDeleted: 0,
        WifiDeleted: 0,
      });
    });

    console.log("Delivery guys updated successfully.");
  } catch (error) {
    console.error("Error updating delivery guys:", error);
    throw error;
  }
};

module.exports = updateDeliveryGuys;
