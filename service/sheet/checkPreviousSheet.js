const getDocumentDataById = require("../utils/getDocumentDataById");

const checkPreviousSheet = async (id) => {
  if (!id) return null;
  const prevSheet = await getDocumentDataById("sheets", id);
  if (prevSheet && prevSheet.tablecount < 15) {
    return {
      message: `You can't create a new sheet since you do not finish the previous one. The previous sheet can hold ${
        15 - prevSheet.tablecount
      } more tables.`,
      type: "info",
      numberOfTablesLeft: 15 - prevSheet.tablecount,
      sheetStatus: prevSheet.sheetStatus,
    };
  }

  return null;
};

module.exports = checkPreviousSheet;
