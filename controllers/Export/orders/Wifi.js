const getDocumentByBranchOrCallcenterIdAndDelete = require("../../../service/utils/getDocumentByBranchIdAndDelete");
const getDocumentsByBranchId = require("../../../service/utils/getDocumentsByBranchId");
const admin = require("../../../config/firebase-admin");
const db = admin.firestore();
const batch = db.batch(); // Create a Firestore batch
/**
 * Create a bank transaction record and update related data.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */

const WifiTable = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
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

    const FileToExport = await getDocumentByBranchOrCallcenterIdAndDelete(
      data.file,
      data.branchId,
      db,
      batch
    );
    console.log(FileToExport);
    const objectKeys = [];
    for (const key in FileToExport) {
      if (typeof FileToExport[key] === "object") {
        objectKeys.push(FileToExport[key]);
      }
    }

    // Remove 'totalCredit' property from each object
    const dataWithoutTotalCredit = objectKeys.map((item) => {
      const {
        createdDate,
        active,
        activeTable,
        activeDailySummery,
        createdAt,
        status,
        type,
        callcenterId,
        branchId,
        order,
        deliveryguyId,
        cardBranch,
        updatedAt,
        ...rest
      } = item;
      return rest;
    });

    // Define the desired order of properties
    const propertyOrder = [
      "name",
      "phone",
      "branchName",
      "blockHouse",
      "ownerName",
      "accountNumber",
      "deliveryguyName",
      "date",
      "callcenterName",
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

    await batch.commit();
    // Respond with a success message
    res.status(200).json({
      data: finalresult,
      message: `Delivery guy salary table exports successfully.`,
    });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = WifiTable;