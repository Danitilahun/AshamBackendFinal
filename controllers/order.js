const checkDocumentExistsInTable = require("../utils/checkDocumentExistsInTable");
const admin = require("../config/firebase-admin");
const generateCustomID = require("../utils/generateCustomID");
const getDocumentById = require("../utils/getDocumentById");
const getDocumentByTwoCriteria = require("../utils/getDocumentByTwoCriteria");
const getSingleDocFromCollection = require("../utils/getSingleDocFromCollection");
const updateBalance = require("../utils/updateBalance");
const updateDataForId = require("../utils/updateDataForId");
const updateProfit = require("../utils/updateProfit");
const updateStatus = require("../utils/updateStatusDoc");
const { getMessaging } = require("firebase-admin/messaging");
const createOrUpdateDocument = require("../utils/createOrUpdateDocument");

const CreateOrder = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const db = admin.firestore();
    const branchesCollection = db.collection(data.type);
    data.createdAt = admin.firestore.FieldValue.serverTimestamp();
    data.openingDate = new Date();
    data.createdAt = admin.firestore.FieldValue.serverTimestamp();
    await branchesCollection.add(data);
    const customerData = {
      name: data.name,
      phone: data.phone,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      blockHouse: data.blockHouse,
      branchId: data.branch,
      branchName: data.branchName,
      createdDate: data.createdDate,
      type: data.type,
    };
    const Id = generateCustomID(`${data.blockHouse}`);
    await createOrUpdateDocument("customer", Id, customerData);
    const notification = await getSingleDocFromCollection("notificationTokens");
    // console.log(notification[data.branch]);
    const registrationToken =
      notification && notification[data.branch]
        ? notification[data.branch]
        : null;
    if (registrationToken) {
      const message = {
        data: {
          title: `New ${data.type} order`,
          body: ` ${data.type} Order for delivery guy ${data.deliveryguyName}`,
        },
        token: registrationToken,
      };

      getMessaging()
        .send(message)
        .then((response) => {
          console.log("Successfully sent message:", response);
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
    }
    const dashboardQuerySnapshot = await db
      .collection("dashboard")
      .limit(1)
      .get();

    if (dashboardQuerySnapshot.empty) {
      return res.status(404).json({ error: "Dashboard document not found" });
    }

    const dashboardDocRef = dashboardQuerySnapshot.docs[0].ref;
    const dashboardData = dashboardQuerySnapshot.docs[0].data();

    // Update the existing branches data with the new branch
    const newEmploye = dashboardData.totalCustomer + 1;

    await dashboardDocRef.update({
      totalCustomer: newEmploye,
    });
    res.status(200).json({ message: `${data.type} order successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("the id is ", id);
    console.log(req.body);
    const data = req.body;
    console.log(data);
    await admin.firestore().collection(data.type).doc(id).update(data);
    res
      .status(200)
      .json({ message: `${data.type} Order updated successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { collection, id } = req.params;
    console.log(id);
    await admin.firestore().collection(collection).doc(id).delete();
    res.status(200).json({ message: `Order deleted successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const changeStatus = async (req, res) => {
  const collectionName = req.params.collectionName;
  const docId = req.params.docId;
  const newStatus = req.params.newStatus;

  const db = admin.firestore();

  console.log(collectionName, docId, newStatus);
  try {
    const docRef = db.collection(collectionName).doc(docId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      res.status(404).json({ message: "Document not found." });
    } else {
      await docRef.update({ status: newStatus });
      res.status(200).json({ message: "Status updated successfully." });
    }
  } catch (error) {
    console.error("Error updating status:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating status." });
  }
};

const AsbezaProfit = async (req, res) => {
  const db = admin.firestore();
  const collectionName = req.params.collectionName;
  const docId = req.params.docId;
  const data = req.body;
  await updateProfit("Asbeza", docId, docId, collectionName, res);
  const Price = await getSingleDocFromCollection("prices");

  console.log(data);
  try {
    const newData1 = {
      asbezaProfit: data.profit,
      asbezaNumber: 1,
      total: data.profit,
    };

    const newData2 = {
      asbezaProfit: data.profit,
      asbezaNumber: 1,
      total: data.profit,
    };
    console.log(Price);
    SalaryData = {
      asbezaNumber: Price.asbezaPrice,
      total: Price.asbezaPrice,
    };

    console.log(newData1);
    console.log(newData2);

    const sheet = await getDocumentByTwoCriteria(
      "sheets",
      "sheetNumber",
      data.sheetNumber,
      "branchId",
      data.branchId
    );
    // console.log(data.date);
    // console.log(sheet.id);
    const customId1 = generateCustomID(
      `${data.date}-${sheet.id}-${data.branchId}`
    );
    const summaryId = generateCustomID(`${sheet.id}-${data.branchId}`);
    const summaryId2 = generateCustomID(
      `${sheet.id}-${data.branchId}-${"16day"}`
    );

    console.log(customId1);
    console.log(summaryId);
    await updateBalance(summaryId, parseInt(data.profit), "order");
    const table1ExistsDaily = await checkDocumentExistsInTable(customId1);
    const table1Exists = await checkDocumentExistsInTable(summaryId);
    if (table1ExistsDaily) {
      await updateDataForId(
        "tables",
        customId1,
        data.deliveryguyId,
        newData1,
        "total",
        newData2
      );
      await updateDataForId(
        "tables",
        summaryId2,
        data.date,
        newData1,
        "total",
        newData2
      );

      await updateDataForId(
        "tables",
        summaryId,
        data.deliveryguyId,
        newData1,
        "total",
        newData2
      );

      console.log("salary data", SalaryData);
      await updateDataForId(
        "salary",
        summaryId,
        data.deliveryguyId,
        SalaryData,
        "total",
        SalaryData
      );
      const income = await getDocumentById("tables", summaryId);
      console.log("salary", income);
      console.log("total income", income["total"]["total"]);
      const totalIncome = parseInt(income["total"]["total"]);
      const totalAsbezaNumber = parseInt(income["total"]["asbezaNumber"]);
      const totalAsbezaProfit = parseInt(income["total"]["asbezaProfit"]);
      await updateStatus(
        summaryId,
        "totalIncome",
        "totalExpense",
        totalIncome,
        totalIncome,
        "table"
      );
      const salary = await getDocumentById("salary", summaryId);
      console.log("salary", salary);
      console.log("total salary", salary["total"]["total"]);
      const branches = await getDocumentById("branches", data.branchId);
      console.log(branches["numberofworker"]);
      // const Price = await getSingleDocFromCollection("prices");
      console.log(Price["fixedSalary"]);
      const totalSalary =
        parseInt(Price["fixedSalary"]) * parseInt(branches["numberofworker"]) +
        parseInt(salary["total"]["total"]);
      await updateStatus(
        summaryId,
        "totalStaffSalary",
        "totalExpense",
        totalSalary,
        totalSalary,
        "salary"
      );
      const db = admin.firestore();
      const dashboardQuerySnapshotBranch = await db
        .collection("branchInfo")
        .limit(1)
        .get();

      const dashboardDocRefBranch = dashboardQuerySnapshotBranch.docs[0].ref;
      const dashboardDataBranch = dashboardQuerySnapshotBranch.docs[0].data();
      // console.log(dashboardDataBranch);
      console.log(dashboardDataBranch[data.branchId]);
      const newData = {
        ...dashboardDataBranch[data.branchId],
        TotalExpense: parseInt(totalSalary),
        Asbeza_N: totalAsbezaNumber,
        Asbeza_P: totalAsbezaProfit,
        TotalProfit: parseInt(totalIncome),
        Status: parseInt(totalIncome) - parseInt(totalSalary),
      };
      console.log(newData);
      const updatedData = {
        ...dashboardDataBranch,
        [data.branchId]: newData,
      };

      console.log(updatedData);
      await dashboardDocRefBranch.update(updatedData);

      const dashboardQuerySnapshot = await db
        .collection("dashboard")
        .limit(1)
        .get();
      const dashboardDocRef = dashboardQuerySnapshot.docs[0].ref;
      const dashboardData = dashboardQuerySnapshot.docs[0].data();

      const existingBranches = dashboardData.data || [];
      const existingBranches2 = dashboardData.data2 || [];
      const updatedBranches = existingBranches.map((branch) => {
        if (branch.ID === data.branchId) {
          return {
            ...branch,
            BranchIncome: parseInt(totalIncome),
            BranchExpense: parseInt(totalSalary),
          };
        }
        return branch;
      });
      const updatedBranches2 = existingBranches2.map((branch) => {
        if (branch.Name === "Asbeza") {
          return {
            ...branch,
            Amount: parseInt(branch.Amount) + parseInt(data.profit),
          };
        }
        return branch;
      });

      // branchesSnapshot.docs.map((doc) => console.log(doc.data()));
      let totalBIncome = 0;
      let totalExpense = 0;
      console.log(existingBranches);
      for (const obj of updatedBranches) {
        totalBIncome += parseInt(obj.BranchIncome);
        totalExpense += parseInt(obj.BranchExpense);
      }

      console.log(totalBIncome);
      console.log(totalExpense);
      await dashboardDocRef.update({
        totalIncome: totalBIncome,
        totalExpense: totalExpense,
        data: updatedBranches,
        data2: updatedBranches2,
      });
    }

    res.status(200).json({ message: "Table updated successfully." });
  } catch (error) {
    console.error("Error updating status:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating status." });
  }
};

const setReminder = async (req, res) => {
  const data = req.body;
  console.log(data);

  try {
    const db = admin.firestore();
    const remindersCollection = db.collection("reminders");

    // Check if a document with the specified type and callcenterId exists
    const querySnapshot = await remindersCollection
      .where("type", "==", data.type)
      .where("callcenterId", "==", data.callcenterId)
      .get();

    if (!querySnapshot.empty) {
      // If document exists, update only the date part of the existing document
      const docId = querySnapshot.docs[0].id;
      await remindersCollection.doc(docId).update({
        date: data.date,
      });
    } else {
      // If document doesn't exist, add a new document
      await remindersCollection.add(data);
    }

    res.status(200).json({ message: "Reminder updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  CreateOrder,
  updateOrder,
  setReminder,
  deleteOrder,
  changeStatus,
  AsbezaProfit,
};
