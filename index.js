const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
var cron = require("node-cron");
const admin = require("./config/firebase-admin");
require("dotenv").config();
// const { Worker, Queue } = require("bull");
const Queue = require("bull");

// configration

const app = express();
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// routes

const adminRoute = require("./routes/admin");
const branchRoute = require("./routes/branch");
const callCenterRoute = require("./routes/callcenter");
const financeRoute = require("./routes/finance");
const deliveryguyRoute = require("./routes/deliveryguy");
const sheetRoute = require("./routes/sheet");
const tableRoute = require("./routes/table");
const priceRoute = require("./routes/gains/price");
const orderRoute = require("./routes/order");
const reportRoute = require("./routes/report");
const creditRoute = require("./routes/credit");
const statusRoute = require("./routes/status");
const bankRoute = require("./routes/bank");
// const dashboardRoute = require("./routes/dashboard");
const notificationRoute = require("./routes/notification");

app.use("/admin", adminRoute);
app.use("/branch", branchRoute);
app.use("/callcenter", callCenterRoute);
app.use("/finance", financeRoute);
app.use("/order", orderRoute);
app.use("/deliveryguy", deliveryguyRoute);
app.use("/sheet", sheetRoute);
app.use("/table", tableRoute);
app.use("/price", priceRoute);
app.use("/report", reportRoute);
app.use("/credit", creditRoute);
app.use("/status", statusRoute);
app.use("/bank", bankRoute);
// app.use("/dashboard", dashboardRoute);
app.use("/notification", notificationRoute);

const apiRoutes = require("./routes/api");
const getSingleDocFromCollection = require("./service/utils/getSingleDocFromCollection");
const updateOrCreateFieldsInDocument = require("./service/utils/updateOrCreateFieldsInDocument");

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("GET request received!");
});

const updateDeliveryGuysAndFields = async () => {
  try {
    const db = admin.firestore();
    const deliveryGuyCollectionRef = admin
      .firestore()
      .collection("deliveryguy");
    const deliveryGuysSnapshot = await deliveryGuyCollectionRef.get();

    const batch = admin.firestore().batch();

    deliveryGuysSnapshot.forEach((doc) => {
      batch.update(doc.ref, { activeness: false });
    });

    const deliveryTurnDocRef = admin
      .firestore()
      .collection("Deliveryturn")
      .doc("turnQueue"); // Replace with the actual document ID

    // Fetch the current data in the document
    const deliveryTurnDocSnapshot = await deliveryTurnDocRef.get();
    const currentData = deliveryTurnDocSnapshot.data() || {};
    console.log("Current data:", currentData);
    // Create an object with the same keys as the current data, but with empty arrays
    const newData = {};
    for (const key in currentData) {
      newData[key] = [];
    }

    // Update the document with the new empty arrays
    batch.update(deliveryTurnDocRef, newData);

    const dashboardQuerySnapshot = await db
      .collection("dashboard")
      .limit(1)
      .get();

    if (dashboardQuerySnapshot.empty) {
      return res.status(404).json({ error: "Dashboard document not found" });
    }

    const dashboardDocRef = dashboardQuerySnapshot.docs[0].ref;
    await dashboardDocRef.update({
      activeEmployees: 0,
    });

    await batch.commit();

    console.log("Delivery guys set as inactive and deliveryTurn fields reset");
  } catch (error) {
    console.error(
      "Error updating delivery guys and deliveryTurn fields:",
      error
    );
  }
};

const updateActiveTablesInAllBranches = async () => {
  const db = admin.firestore();
  try {
    // Get all documents from the "branches" collection
    const querySnapshot = await db.collection("branches").get();

    // Create an array to store promises for document updates
    const updatePromises = [];

    // Update each branch document
    querySnapshot.forEach((doc) => {
      // Create a promise for each update operation
      const updatePromise = db
        .collection("branches")
        .doc(doc.id)
        .update({
          activeTable: "",
        })
        .then(() => {
          console.log(`Branch ${doc.id} updated successfully.`);
        })
        .catch((error) => {
          console.error(`Error updating branch ${doc.id}:`, error);
        });

      updatePromises.push(updatePromise);
    });

    // Wait for all update promises to resolve
    await Promise.all(updatePromises);

    console.log("All branches updated successfully.");
  } catch (error) {
    console.error("Error fetching or updating branches: ", error);
  }
};

const updateCardCollection = async () => {
  const db = admin.firestore();
  try {
    // Get all documents from the "Card" collection where "dayremain" > 0
    const querySnapshot = await db
      .collection("Card")
      .where("dayRemain", ">", 0)
      .get();
    const companyGain = await getSingleDocFromCollection("companyGain");
    // Create an array to store promises for document updates
    const updatePromises = [];
    // Update each document
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const remainMoney = data.remaingMoney - companyGain.card_price;
      const dayremain = parseInt(remainMoney / companyGain.card_price);

      // Create a promise for each update operation
      const updatePromise = db
        .collection("Card")
        .doc(doc.id)
        .update({
          remaingMoney: remainMoney,
          dayRemain: dayremain,
        })
        .then(() => {
          console.log(`Document ${doc.id} updated successfully.`);
        })
        .catch((error) => {
          console.error(`Error updating document ${doc.id}:`, error);
        });

      updatePromises.push(updatePromise);
    });

    // Wait for all update promises to resolve
    await Promise.all(updatePromises);

    console.log("All documents updated successfully.");
  } catch (error) {
    console.error("Error fetching or updating documents: ", error);
  }
};

process.env.TZ = "Asia/Tokyo";

cron.schedule("1 6 * * *", async () => {
  console.log("Scheduled task running at 6:01 AM ...");
  await updateDeliveryGuysAndFields();
  await updateCardCollection();
  await updateActiveTablesInAllBranches();
});

// cron.schedule("27 23 * * *", async () => {
//   console.log("Scheduled task running at 11:19 PM in Asia/Tokyo timezone...");
//   await updateDeliveryGuysAndFields();
//   await updateCardCollection();
// });
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
