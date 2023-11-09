const getDocumentDataById = require("../service/utils/getDocumentDataById");

const checkBranchData = async (req, res, next) => {
  const data = req.body;

  try {
    const branch = await getDocumentDataById(
      "branches",
      data.cardBranch ? data.cardBranch : data.branchKey
    );
    if (
      !branch ||
      !branch.active ||
      !branch.activeSheet ||
      !branch.activeTable
    ) {
      return res.status(400).json({
        message:
          "You can't create an order since there is no daily table or sheet.",
      });
    }

    console.log("checkBranchDataMiddleware");
    next();
  } catch (error) {
    console.error("Error in checkBranchData middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = checkBranchData;
