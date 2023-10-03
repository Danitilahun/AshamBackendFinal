const formatDateRange = require("../utils/DataRange");
const checkDocumentExistsInSalary = require("../utils/checkDoc");
const admin = require("../config/firebase-admin");
const generateCustomID = require("../utils/generateCustomID");
const getDocumentById = require("../utils/getDocumentById");
const getDocumentByTwoFeature = require("../utils/getDocumentByTwoFeature");
const pushToFieldArray = require("../utils/pushToFieldArray");
const updateOrCreateDocument = require("../utils/updateOrCreateDocument");
const popArrayElement = require("../utils/popArrayObjectElement");
const updateOrCreateFieldsInDocument = require("../service/utils/updateOrCreateFieldsInDocument");
// const popArrayElement = require("../utils/popArrayElement");

async function createStatusCollection(id, date) {
  const deliveryTurnCollectionRef = db.collection("Status").doc(id);
  const deliveryTurnDocumentSnapshot = await deliveryTurnCollectionRef.get();

  if (!deliveryTurnDocumentSnapshot.exists) {
    return deliveryTurnCollectionRef.set({
      totalStaffSalary: 0,
      totalDeliveryGuySalary: 0,
      totalIncome: 0,
      totalExpense: 0,
      totaltax: 0,
      date: date,
    });
  }
}

const Createsheet = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    const prevSheet = await getDocumentByTwoFeature(
      data.branchId,
      data.sheetNumber - 1
    );

    console.log(prevSheet);
    if (prevSheet && prevSheet.tablecount < 15) {
      console.log("prevSheet.tablecount", prevSheet.tablecount);
      return res.status(200).json({
        message: `You can't create new sheet since you do not finish the previous one.The previous sheet can hold ${
          15 - prevSheet.tablecount
        } more table.`,
        id: null,
        active: null,
      });
    }

    const docExistes = await getDocumentById("Status", data.previousActive);
    const branch = await getDocumentById("branches", data.branchId);
    const totalCredit = await getDocumentById("totalCredit", data.branchId);
    if (docExistes) {
      console.log("docExistes", docExistes);
      const date = formatDateRange(data.date);
      console.log("date", date);
      console.log("branch", branch);
      const amount =
        parseInt(docExistes.totalIncome) - parseInt(docExistes.totalExpense);
      console.log("result", amount);
      const status = amount > 0 ? "profit" : "loss";

      await pushToFieldArray("Budget", data.branchId, "sheetSummery", {
        date: date,
        status: status,
        amount: amount,
        totalExpense: docExistes.totalExpense,
        totalIncome: docExistes.totalIncome,
        wifi: branch.wifi,
        totalStaffSalary: docExistes.totalStaffSalary,
        ethioTelBill: branch.ethioTelBill,
        houseKeeper: branch.houseKeeper,
        cleanerSalary: branch.cleanerSalary,
        houseRent: branch.houseRent,
        taxPersentage: branch.taxPersentage,
        totalCredit: totalCredit.total,
      });
    }

    data.tablecount = 0;
    data.tableDate = [];

    const db = admin.firestore();
    const sheetsCollection = db.collection("sheets");
    // Add the new document and capture the reference
    data.openingDate = new Date();
    data.createdAt = admin.firestore.FieldValue.serverTimestamp();
    const newDocRef = await sheetsCollection.add(data);
    // Retrieve the ID from the reference
    const newDocId = newDocRef.id;
    const customId1 = generateCustomID(`${newDocId}-${data.branchId}`);
    const customId2 = generateCustomID(
      `${newDocId}-${data.branchId}-${"16day"}`
    );
    await createStatusCollection(customId1, data.date);
    // await createBankCollection(customId1);
    await updateOrCreateDocument(
      "branches",
      data.branchId,
      "active",
      customId1
    );

    await updateOrCreateDocument(
      "branches",
      data.branchId,
      "activeSheet",
      newDocId
    );
    await updateOrCreateDocument(
      "branches",
      data.branchId,
      "activeDailySummery",
      customId2
    );

    res.status(200).json({
      message: `Sheet successfully created.`,
      id: newDocId,
      active: customId1, // Include the ID in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deletesheet = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);
    const sheetdata = await getDocumentById("sheets", id);
    await admin.firestore().collection("sheets").doc(id).delete();
    await admin.firestore().collection("Status").doc(sheetdata.active).delete();
    await admin.firestore().collection("Bank").doc(sheetdata.active).delete();
    await admin.firestore().collection("tables").doc(sheetdata.active).delete();
    await admin
      .firestore()
      .collection("tables")
      .doc(sheetdata.activeDaily)
      .delete();
    await admin
      .firestore()
      .collection("Calculator")
      .doc(sheetdata.active)
      .delete();
    const branch = await getDocumentById("branches", sheetdata.branchId);
    if (branch.activeSheet === id) {
      await updateOrCreateFieldsInDocument("branches", sheetdata.branchId, {
        activeSheet: "",
        activeTable: "",
        active: "",
        activeDailySummery: "",
      });
    }
    await popArrayElement(
      "salaryTable",
      {
        name: sheetdata.name,
        id: sheetdata.active,
      },
      sheetdata.branchId,
      "branches"
    );

    await admin.firestore().collection("salary").doc(sheetdata.active).delete();
    await admin
      .firestore()
      .collection("staffSalary")
      .doc(sheetdata.active)
      .delete();
    if (sheetdata.Tables !== undefined) {
      for (const tableId of sheetdata.Tables) {
        await admin.firestore().collection("tables").doc(tableId).delete();
      }
    }

    res.status(200).json({ message: `sheet deleted successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  Createsheet,
  deletesheet,
};
