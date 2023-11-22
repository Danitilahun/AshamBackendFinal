const admin = require("../../../config/firebase-admin");
const swapCreditDocument = require("../../../service/credit/totalCredit/SwapCredit");
const updateCreditDocument = require("../../../service/credit/totalCredit/updateCreditDocument");
const updateCalculator = require("../../../service/credit/updateCalculator/updateCalculator");
const updateSalaryTable = require("../../../service/credit/updateSalaryTable/updateSalaryTable");
const payDailySalary = require("../../../service/users/handleDeliveryGuySalaryPay/payDailySalary");
const swapCredit = require("../../../service/users/handleDeliveryGuySalaryPay/swapCredit");
const updateDashboardActiveDeliveryGuy = require("../../../service/users/updateDashboard/updateActiveDeliveryGuy");
const updateOrCreateFieldsInDocument = require("../../../service/utils/updateOrCreateFieldsInDocument");

const handlePayController = async (req, res) => {
  const { id, active } = req.params;
  const data = req.body;

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
        console.log("here");
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
      batch
    );

    await swapCreditDocument(
      data.branchId,
      "DailyCredit",
      "StaffCredit",
      credit,
      credit,
      db,
      batch
    );

    const salaryUpdate = {
      totalCredit: parseInt(data.amount),
    };

    await updateSalaryTable(
      "salary",
      active,
      id,
      "total",
      salaryUpdate,
      db,
      batch
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
