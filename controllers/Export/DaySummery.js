const getDocumentDataById = require("../../service/utils/getDocumentDataById");

/**
 * Create a bank transaction record and update related data.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */

const DaySummeryTable = async (req, res) => {
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

    const FileToExport = await getDocumentDataById(data.file, data.id);

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
      const { uniqueName, ...rest } = item;
      return rest;
    });

    // Define the desired order of properties
    const propertyOrder = [
      "name",
      "asbezaNumber",
      "asbezaProfit",
      "wifiCollect",
      "wifiDistribute",
      "waterCollect",
      "waterDistribute",
      "cardFee",
      "cardCollect",
      "cardDistribute",
      "hotelProfit",
      "total",
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

    // Find the object with name "total"
    const totalObject = finalresult.find((item) => item.Name === "total");

    // Remove the object with name "total" from the array
    const filteredResult = finalresult.filter((item) => item.Name !== "total");

    // Push the "total" object to the end of the array
    filteredResult.push(totalObject);

    const compareDates = (a, b) => {
      const dateA = new Date(a.Name);
      const dateB = new Date(b.Name);
      return dateA - dateB;
    };

    // Sort the array based on the "date" field
    filteredResult.sort(compareDates);

    // Respond with a success message
    res.status(200).json({
      data: filteredResult,
      message: `Delivery guy salary table exports successfully.`,
    });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = DaySummeryTable;
