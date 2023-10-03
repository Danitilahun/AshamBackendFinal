const admin = require("../../../config/firebase-admin");
const payDailySalary = require("../../../service/users/handleDeliveryGuySalaryPay/payDailySalary");
const swapCredit = require("../../../service/users/handleDeliveryGuySalaryPay/swapCredit");
const updateDashboardActiveDeliveryGuy = require("../../../service/users/updateDashboard/updateActiveDeliveryGuy");

const handlePayController = async (req, res) => {
  const { id, active } = req.params;

  // Create Firestore database and batch
  const db = admin.firestore();
  const batch = db.batch();

  try {
    const db = admin.firestore();
    let credit = 0;
    const deliveryGuyRef = db.collection("deliveryguy").doc(id);
    const deliveryGuySnapshot = await deliveryGuyRef.get();
    if (deliveryGuySnapshot.exists) {
      if (deliveryGuySnapshot.data().dailyCredit > 0) {
        credit = await swapCredit(
          id,
          deliveryGuySnapshot.data(),
          active,
          db,
          batch
        );
      }

      if (deliveryGuySnapshot.data().activeness) {
        await updateDashboardActiveDeliveryGuy(-1, db, batch);
      }
      batch.update(deliveryGuyRef, {
        activeness: false,
        paid: true,
        waiting: false,
      });
    }
    await payDailySalary(
      active,
      id,
      deliveryGuySnapshot.data().branchId,
      db,
      batch,
      credit
    );

    // Commit the batch updates
    await batch.commit();
    return res.status(200).json({ message: "Data successfully updated." });
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

module.exports = handlePayController;