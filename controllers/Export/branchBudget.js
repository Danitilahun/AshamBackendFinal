/**
 * Create a bank transaction record and update related data.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
const admin = require("../../config/firebase-admin");
const getDocumentDataById = require("../../service/utils/getDocumentDataById");
const getDocumentsByBranchId = require("../../service/utils/getDocumentsByBranchId");
const updateOrCreateFieldsInDocument = require("../../service/utils/updateOrCreateFieldsInDocument");

const BudgetTable = async (req, res) => {
  try {
    const data = req.body;

    const db = admin.firestore();
    const batch = db.batch(); // Create a Firestore batch

    if (!data) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }

    if (!data.branchId) {
      return res.status(400).json({
        message:
          "Branch information is missing.If you are sure you have a branch.Please refresh your browser and try again.",
      });
    }

    let FileToExport = await getDocumentDataById("Budget", data.branchId);
    FileToExport = FileToExport.sheetSummary;
    if (
      !FileToExport ||
      (Array.isArray(FileToExport) && FileToExport.length === 0) ||
      (typeof FileToExport === "object" &&
        Object.keys(FileToExport).length === 0)
    ) {
      return res.status(400).json({
        message: `No exportable data found. Please ensure you have data to export.`,
      });
    }

    const objectKeys = [];
    for (const key in FileToExport) {
      if (typeof FileToExport[key] === "object") {
        objectKeys.push(FileToExport[key]);
      }
    }

    // Remove 'totalCredit' property from each object
    const dataWithoutTotalCredit = objectKeys.map((item) => {
      const { branchId, createdAt, date, createdDate, ...rest } = item;
      return rest;
    });

    // Define the desired order of properties
    const propertyOrder = ["dayRange"];

    // Function to reorder properties based on the desired order
    const reorderProperties = (obj, order) => {
      return Object.keys(obj)
        .sort((a, b) => order.indexOf(a) - order.indexOf(b))
        .reduce((acc, key) => {
          acc[key] = obj[key];
          return acc;
        }, {});
    };

    // Apply the function to each object in the array
    const result = dataWithoutTotalCredit.map((item) =>
      reorderProperties(item, propertyOrder)
    );

    const finalresult = result.map((item) => {
      for (const key in item) {
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        if (key !== capitalizedKey) {
          item[capitalizedKey] = item[key];
          delete item[key];
        }
      }
      return item;
    });

    const reorderedArray = finalresult.map((item) => ({
      TotalIncome: item.TotalIncome,
      TotalExpense: item.TotalExpense,
      Amount: item.Amount,
      DayRange: item.DayRange,
      Sheetstatus: item.Sheetstatus,
      TaxPersentage: item.TaxPersentage,
      Totaltax: item.Totaltax,
      ...item,
    }));

    if (data.clear === true) {
      await updateOrCreateFieldsInDocument(db, batch, "Budget", data.branchId, {
        sheetSummary: [],
      });
    }
    await batch.commit();
    // Respond with a success message
    res.status(200).json({
      data: reorderedArray,
      message: `Delivery guy salary table exports successfully.`,
    });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = BudgetTable;
