const admin = require("../config/firebase-admin");

// Function to create the "Deliveryturn" collection if it doesn't exist

// Arrow function to handle the incoming request and process the data
const handleDeliveryRequest = async (req, res) => {
  db = admin.firestore();
  const { active, branchId, deliveryManId, deliveryGuyName, activeness } =
    req.body;

  try {
    // Ensure "Deliveryturn" collection exists

    const deliveryGuyRef = db.collection("deliveryguy").doc(deliveryManId);

    const deliveryGuySnapshot = await deliveryGuyRef.get();
    console.log(active, branchId, deliveryManId, deliveryGuyName);
    if (deliveryGuySnapshot.exists) {
      // If activeness field exists, update its value with the provided active value
      console.log(deliveryGuySnapshot.data());
      const waiting = deliveryGuySnapshot.data().waiting;
      if (waiting) {
        await deliveryGuyRef.update({ activeness: active });
      } else {
        await deliveryGuyRef.update({
          activeness: active,
          paid: false,
          waiting: true,
        });
      }
    }

    // console.log(deliveryGuySnapshot.data());

    const docRef = db.collection("Deliveryturn").doc("turnQueue");

    await db.runTransaction(async (transaction) => {
      const docSnapshot = await transaction.get(docRef);

      if (!docSnapshot.exists) {
        // If the document does not exist, create it with the field using branchId as a key
        const newDocData = {
          [branchId]: [
            { deliveryManId: deliveryManId, deliveryGuyName: deliveryGuyName },
          ],
        };
        transaction.set(docRef, newDocData);
        return;
      }

      const existingData = docSnapshot.data();
      const existingQueue = existingData[branchId] || [];

      if (active) {
        // If active is true, add to queue (similar to previous behavior)
        existingQueue.push({
          deliveryManId: deliveryManId,
          deliveryGuyName: deliveryGuyName,
        });
      } else {
        // If active is false, remove the specified item from the queue, maintaining order
        const updatedQueue = existingQueue.filter(
          (item) =>
            item.deliveryManId !== deliveryManId ||
            item.deliveryGuyName !== deliveryGuyName
        );
        existingQueue.length = 0;
        existingQueue.push(...updatedQueue);
      }

      transaction.update(docRef, { [branchId]: existingQueue });
    });

    // await incrementFieldByOne("branches", fields.branch, "numberofworker", 1);
    const dashboardQuerySnapshot = await db
      .collection("dashboard")
      .limit(1)
      .get();

    if (dashboardQuerySnapshot.empty) {
      return res.status(404).json({ error: "Dashboard document not found" });
    }

    const dashboardDocRef = dashboardQuerySnapshot.docs[0].ref;
    const dashboardData = dashboardQuerySnapshot.docs[0].data();
    if (activeness !== undefined) {
      console.log("activeness", activeness);
      if (activeness) {
        const newEmploye = dashboardData.activeEmployees - 1;
        await dashboardDocRef.update({
          activeEmployees: newEmploye,
        });
      }
    } else {
      if (active) {
        const newEmploye = dashboardData.activeEmployees + 1;

        await dashboardDocRef.update({
          activeEmployees: newEmploye,
        });
      } else {
        const newEmploye = dashboardData.activeEmployees - 1;

        await dashboardDocRef.update({
          activeEmployees: newEmploye,
        });
      }
    }

    // Update the existing branches data with the new branch

    return res.status(200).json({ message: "Data successfully updated." });
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

module.exports = { handleDeliveryRequest };
