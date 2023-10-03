const crypto = require("crypto");
const admin = require("../config/firebase-admin");
const getAllDeliveryGuyIdsByBranchId = require("../utils/getAllDeliveryGuyIdsByBranchId");
const checkDocumentExistsInTable = require("../utils/checkDocumentExistsInTable");
const getDeliveryToWorkMapping = require("../utils/getDeliveryToWorkMapping");
const generateCustomID = require("../utils/generateCustomID");
const getDocumentById = require("../utils/getDocumentById");
const incrementCount = require("../utils/incrementCount");
const pushToFieldArray = require("../utils/pushToFieldArray");
const checkDocumentExistsInSalary = require("../utils/checkDoc");
const updateOrCreateDocument = require("../utils/updateOrCreateDocument");
const getDefaultDataObject = require("../utils/createWork");
const addFieldToDocument = require("../utils/addFieldToDocument");
const addHolidayBonusToDocument = require("../utils/updateBonusesById");
const deleteField = require("../utils/deleteField");
const popArrayElement = require("../utils/popArrayElement");
const getStaffToWorkMapping = require("../utils/getStaffToWorkMapping");

// Create "works" collection for each delivery guy with its own unique ID
const createTable = async (req, res) => {
  const { date, sheetId, branchId } = req.body;

  try {
    const documentData = await getDocumentById("sheets", sheetId);
    console.log("Document data:", documentData.tablecount);
    const count = documentData.count;
    if (count == 15) {
      return res.status(409).json({
        error: "There are already 15 table on this sheet.Create other one.",
      });
    }
    // Generate custom ID using date, sheetId, and branchId
    const customId1 = generateCustomID(`${date}-${sheetId}-${branchId}`);

    // Check if a table with customId1 exists
    const table1Exists = await checkDocumentExistsInTable(customId1);
    let deliveryGuyIds = null;
    if (table1Exists) {
      return res.status(409).json({
        error: "The table with the given date already exists.",
      });
    } else {
      // Create "tables" document with customId1
      console.log("branchId", branchId);
      deliveryGuyIds = await getAllDeliveryGuyIdsByBranchId(
        "deliveryguy",
        branchId
      );
      console.log(deliveryGuyIds);
      deliveryGuyIds.push({ id: "total", uniqueName: "total", name: "total" });
      const deliveryToWorkMapping_normal = await getDeliveryToWorkMapping(
        deliveryGuyIds
      );

      deliveryToWorkMapping_normal["sheetId"] = sheetId;
      deliveryToWorkMapping_normal["branchId"] = branchId;
      deliveryToWorkMapping_normal["date"] = date;

      console.log("delivery_normal", deliveryToWorkMapping_normal);
      await admin
        .firestore()
        .collection("tables")
        .doc(customId1)
        .set(deliveryToWorkMapping_normal);

      await pushToFieldArray("sheets", sheetId, "tableDate", date);
      await pushToFieldArray("sheets", sheetId, "Tables", customId1);
      await incrementCount("sheets", sheetId);
      await updateOrCreateDocument(
        "branches",
        branchId,
        "activeTable",
        customId1
      );
      const worksDocId = getDefaultDataObject();
      worksDocId.uniqueName = "";
      worksDocId.name = date;
      const customId2 = generateCustomID(`${sheetId}-${branchId}-${"16day"}`);
      await addFieldToDocument("tables", customId2, date, worksDocId);
    }

    res.json({
      id: customId1,
      message: "Table collection created successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "An error occurred while creating works collection and tables collection.",
    });
  }
};

const createSummeryTable = async (req, res) => {
  const { sheetId, branchId } = req.body;
  console.log(sheetId, branchId);
  // return;
  try {
    // Generate custom ID using date, sheetId, and branchId
    // Generate custom ID using only sheetId and branchId
    const customId2 = generateCustomID(`${sheetId}-${branchId}`);
    // Check if a table with customId1 exists
    const table2Exists = await checkDocumentExistsInTable(customId2);

    if (!table2Exists) {
      deliveryGuyIds = await getAllDeliveryGuyIdsByBranchId(
        "deliveryguy",
        branchId
      );
      deliveryGuyIds.push({ id: "total", uniqueName: "total", name: "total" });
      const deliveryToWorkMapping_summary = await getDeliveryToWorkMapping(
        deliveryGuyIds
      );

      deliveryToWorkMapping_summary["sheetId"] = sheetId;
      deliveryToWorkMapping_summary["branchId"] = branchId;
      // deliveryToWorkMapping_summary["date"] = date;

      console.log(deliveryGuyIds);
      console.log("delivery_summary", deliveryToWorkMapping_summary);
      await admin
        .firestore()
        .collection("tables")
        .doc(customId2)
        .set(deliveryToWorkMapping_summary);

      await updateOrCreateDocument("sheets", sheetId, "active", customId2);
      await create16SummeryTable(req, res);
    }
    // Create "tables" document with customId2

    res.json({
      customId2,
      message: "Table collection created successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "An error occurred while creating works collection and tables collection.",
    });
  }
};

const create16SummeryTable = async (req, res) => {
  const { sheetId, branchId } = req.body;
  try {
    // Generate custom ID using date, sheetId, and branchId
    // Generate custom ID using only sheetId and branchId
    const customId2 = generateCustomID(`${sheetId}-${branchId}-${"16day"}`);
    // Check if a table with customId1 exists
    const table2Exists = await checkDocumentExistsInTable(customId2);

    if (!table2Exists) {
      // deliveryGuyIds = await getAllDeliveryGuyIdsByBranchId(branchId);
      // deliveryGuyIds.push("total");
      const worksDocId = getDefaultDataObject();
      worksDocId.uniqueName = "";
      worksDocId.name = "total";
      const deliveryToWorkMapping_summary = {};
      deliveryToWorkMapping_summary.total = worksDocId;
      deliveryToWorkMapping_summary["sheetId"] = sheetId;
      deliveryToWorkMapping_summary["branchId"] = branchId;
      // deliveryToWorkMapping_summary["date"] = date;

      console.log(deliveryGuyIds);
      console.log("delivery_summary", deliveryToWorkMapping_summary);
      await admin
        .firestore()
        .collection("tables")
        .doc(customId2)
        .set(deliveryToWorkMapping_summary);
      await updateOrCreateDocument("sheets", sheetId, "activeDaily", customId2);
    }
    // Create "tables" document with customId2
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while adding the 16 day summery table.");
  }
};

const createSalaryTable = async (req, res) => {
  const { sheetId, branchId } = req.body;

  try {
    // Check if a table with customId2 exists
    const customId1 = generateCustomID(`${sheetId}-${branchId}`);
    const table2Exists = await checkDocumentExistsInSalary(customId1, "salary");

    if (!table2Exists) {
      deliveryGuyIds = await getAllDeliveryGuyIdsByBranchId(
        "deliveryguy",
        branchId
      );
      staffs = await getAllDeliveryGuyIdsByBranchId("staff", branchId);

      deliveryGuyIds.push({ id: "total", uniqueName: "total", name: "total" });
      staffs.push({ id: "total", uniqueName: "total", name: "total" });
      const deliveryToWorkMapping_salary = await getDeliveryToWorkMapping(
        deliveryGuyIds,
        "salary"
      );

      const staffToWorkMapping_salary = await getStaffToWorkMapping(staffs);

      deliveryToWorkMapping_salary["sheetId"] = sheetId;
      deliveryToWorkMapping_salary["branchId"] = branchId;

      staffToWorkMapping_salary["sheetId"] = sheetId;
      staffToWorkMapping_salary["branchId"] = branchId;

      await admin
        .firestore()
        .collection("salary")
        .doc(customId1)
        .set(deliveryToWorkMapping_salary);

      await admin
        .firestore()
        .collection("staffSalary")
        .doc(customId1)
        .set(staffToWorkMapping_salary);

      const salary = await getDocumentById("sheets", sheetId);
      await pushToFieldArray("branches", branchId, "salaryTable", {
        name: salary.name,
        id: customId1,
      });
    }
    // Create "tables" document with customId2

    res.json({
      customId1,
      message: "Table collection created successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "An error occurred while creating works collection and tables collection.",
    });
  }
};

const createCalculator = async (req, res) => {
  const { sheetId, branchId } = req.body;
  try {
    // Check if a table with customId2 exists
    const customId1 = generateCustomID(`${sheetId}-${branchId}`);
    const exist = await checkDocumentExistsInSalary(customId1, "Calculator");
    const totalCredit = await getDocumentById("totalCredit", branchId);
    if (!exist) {
      const formData = {
        200: 0,
        100: 0,
        50: 0,
        10: 0,
        5: 0,
        1: 0,
        sum: 0,
        actual: -totalCredit.total,
        balance: -totalCredit.total,
        totalCredit: totalCredit.total,
        active: customId1,
        sheetId: sheetId,
        branchId: branchId,
        openingDate: new Date(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await admin
        .firestore()
        .collection("Calculator")
        .doc(customId1)
        .set(formData);
    }

    res.json({
      customId1,
      message: "Table collection created successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "An error occurred while creating works collection and tables collection.",
    });
  }
};

const updateCalculator = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("the id is ", id);
    console.log(req.body);
    const data = req.body;
    console.log(data);
    await admin.firestore().collection("Calculator").doc(id).update(data);
    res
      .status(200)
      .json({ message: `Branch ${data.name} updated successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const addHoliday = async (req, res) => {
  const { docId, holidayBonus, branchId } = req.body;
  console.log(docId, holidayBonus, branchId);
  if (!docId || isNaN(holidayBonus)) {
    res.status(400).json({ error: "Invalid input data." });
    return;
  }

  const result = await addHolidayBonusToDocument(docId, holidayBonus, branchId);

  if (result) {
    res.status(200).json({ message: "Holiday bonuses added successfully!" });
  } else {
    res.status(404).json({ error: "Document not found." });
  }
};

const DeleteTable = async (req, res) => {
  const { id, active, fieldName, sheetId } = req.params;
  console.log(id, active, fieldName);
  await admin.firestore().collection("tables").doc(id).delete();
  await deleteField(fieldName, active, "tables");
  await updateOrCreateDocument(
    "branches",
    sheetdata.branchId,
    "activeTable",
    ""
  );
  await popArrayElement("tableDate", fieldName, sheetId, "sheets");
  try {
    res.status(200).json({ message: "Table Deleted SuccessFully" });
  } catch (error) {
    res.status(404).json({ error: "Document not found." });
  }
};

module.exports = {
  createTable,
  addHoliday,
  createSalaryTable,
  createSummeryTable,
  createCalculator,
  DeleteTable,
  create16SummeryTable,
  updateCalculator,
};
