const admin = require("../../../config/firebase-admin");
const getDocumentByBranchAndThenDelete = require("../../../service/utils/getAndDelete");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const getDocumentsByBranchId = require("../../../service/utils/getDocumentsByBranchId");

const StaffCreditExportTable = async (req, res) => {
  const db = admin.firestore();
  const batch = db.batch();
  try {
    const data = req.body;

    if (!data) {
      return res.status(400).json({
        message:
          "Request body is missing or empty. Please refresh your browser and try again.",
      });
    }

    const FileToExport = await getDocumentsByBranchId(
      "StaffCredit",
      data.branchId
    );

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
      const {
        branchId,
        createdAt,
        calculatorId,
        source,
        employeeId,
        active,
        type,
        borrowedOn,
        ...rest
      } = item;
      return rest;
    });

    // Manually define the order of properties
    const propertyOrder = [
      "employeeName",
      "placement",
      "amount",
      "date",
      "reason",
    ];

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

    console.log(finalresult);
    const reorderedArray = finalresult.map((item) => ({
      EmployeeName: item.EmployeeName,
      Placement: item.Placement,
      Amount: item.Amount,
      Reason: item.Reason,
      BorrowedOn: convertDate(item.Date),
    }));

    await batch.commit();
    console.log(reorderedArray);
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

module.exports = StaffCreditExportTable;
