/**
 * Create a bank transaction record and update related data.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */

const getDocumentDataById = require("../../service/utils/getDocumentDataById");

const SheetStatusExport = async (req, res) => {
  try {
    const data = req.body;

    if (!data) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }

    if (!data.id) {
      return res.status(400).json({
        message:
          "Please create sheet before try to export.If you are sure you have a sheet.Please refresh your browser and try again.",
      });
    }

    if (!data.branchId) {
      return res.status(400).json({
        message:
          "Branch information is missing.If you are sure you have a branch.Please refresh your browser and try again.",
      });
    }

    const originalObject = await getDocumentDataById(data.file, data.id);
    // Respond with a success message

    if (
      !originalObject ||
      (Array.isArray(originalObject) && originalObject.length === 0) ||
      (typeof originalObject === "object" &&
        Object.keys(originalObject).length === 0)
    ) {
      return res.status(400).json({
        message: `No exportable data found. Please ensure you have data to export.`,
      });
    }

    const keysToMap = [
      { key: "wifi", ownerKey: "wifiOwnerName", accountKey: "wifiAccount" },
      {
        key: "houseRent",
        ownerKey: "houseRentOwnerName",
        accountKey: "houseRentAccount",
      },
      {
        key: "ethioTelBill",
        ownerKey: "ethioTelOwnerName",
        accountKey: "ethioTelAccount",
      },
      {
        key: "totalStaffSalary",
        ownerKey: "totalStaffSalaryName",
        accountKey: "totalStaffSalaryAccount",
      },
      {
        key: "totalDeliveryGuySalary",
        ownerKey: "totalDeliveryGuySalaryName",
        accountKey: "totalDeliveryGuySalaryAccount",
      },
      {
        key: "totaltax",
        ownerKey: "totaltaxName",
        accountKey: "totaltaxAccount",
      },
    ];

    const resultArray = keysToMap.map((item) => ({
      Name: item.key.charAt(0).toUpperCase() + item.key.slice(1),
      Amount: originalObject[item.key],
      OwnerName: originalObject[item.ownerKey] || "Don't have owner",
      Account: originalObject[item.accountKey] || "Don't have Account",
    }));

    const branch = await getDocumentDataById("branches", data.branchId);
    if (branch.ExpenseOneName && branch.ExpenseOneAmount) {
      resultArray.push({
        Name:
          branch.ExpenseOneName.charAt(0).toUpperCase() +
          branch.ExpenseOneName.slice(1),
        Amount: branch.ExpenseOneAmount,
        OwnerName: "Don't have owner",
        Account: "Don't have Account",
      });
    }

    if (branch.ExpenseTwoName && branch.ExpenseTwoAmount) {
      resultArray.push({
        Name:
          branch.ExpenseTwoName.charAt(0).toUpperCase() +
          branch.ExpenseTwoName.slice(1),
        Amount: branch.ExpenseTwoAmount,
        OwnerName: "Don't have owner",
        Account: "Don't have Account",
      });
    }

    if (branch.ExpenseThreeName && branch.ExpenseThreeAmount) {
      resultArray.push({
        Name:
          branch.ExpenseThreeName.charAt(0).toUpperCase() +
          branch.ExpenseThreeName.slice(1),
        Amount: branch.ExpenseThreeAmount,
        OwnerName: "Don't have owner",
        Account: "Don't have Account",
      });
    }

    resultArray.push({
      Name: "TotalExpense",
      Amount: originalObject.totalExpense,
      OwnerName: "Don't have owner",
      Account: "Don't have Account",
    });

    resultArray.push({
      Name: "TotalIncome",
      Amount: originalObject.totalIncome,
      OwnerName: "Don't have owner",
      Account: "Don't have Account",
    });
    const Credit = await getDocumentDataById("totalCredit", data.branchId);
    resultArray.push({
      Name: "TotalCredit",
      Amount: Credit?.total ? Credit.total : 0,
      OwnerName: "Don't have owner",
      Account: "Don't have Account",
    });
    console.log(resultArray);

    res.status(200).json({
      data: resultArray,
      message: `${data.file} exports successfully.`,
    });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = SheetStatusExport;
