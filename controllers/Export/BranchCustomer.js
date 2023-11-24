const getDocumentDataById = require("../../service/utils/getDocumentDataById");
const getDocumentsByBranchId = require("../../service/utils/getDocumentsByBranchId");

const BranchCustomerTable = async (req, res) => {
  try {
    const data = req.body;

    if (!data) {
      return res.status(400).json({
        message:
          "Request body is missing or empty. Please refresh your browser and try again.",
      });
    }

    const FileToExport = await getDocumentsByBranchId(data.file, data.branchId);
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
      const { branchId, createdAt, type, branchName, ...rest } = item;
      return rest;
    });

    // Manually define the order of properties
    const propertyOrder = [
      "name",
      "phone",
      "blockHouse",
      "Card",
      "Water",
      "Wifi",
      "Asbeza",
      "createdDate",
    ];

    // Function to reorder properties based on the desired order
    const reorderPropertiesWithOrder = (obj, order) => {
      const reorderedObject = {};
      // First, add "name," "phone," and "blockHouse" properties
      for (const key of ["name", "phone", "blockHouse"]) {
        if (obj.hasOwnProperty(key)) {
          reorderedObject[key] = obj[key];
        }
      }
      // Then, add the rest of the properties in the specified order
      for (const key of order) {
        if (
          obj.hasOwnProperty(key) &&
          key !== "name" &&
          key !== "phone" &&
          key !== "blockHouse"
        ) {
          reorderedObject[key] = obj[key];
        }
      }
      return reorderedObject;
    };

    // Apply the function to each object in the array
    const result = dataWithoutTotalCredit.map((item) =>
      reorderPropertiesWithOrder(item, propertyOrder)
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
      Name: item.Name,
      Phone: item.Phone,
      BlockHouse: item.BlockHouse,
      ...item,
    }));

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

module.exports = BranchCustomerTable;
