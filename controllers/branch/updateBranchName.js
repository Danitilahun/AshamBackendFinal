/**
 * Edit an expense document in the "expense" Firestore collection.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */

const UpdateMainData = require("../../service/branches/dashBoard/dashboardNamechange");
const UpdateBranchData = require("../../service/branches/dashBoard/nameChange");

const updateBranchName = async (req, res) => {
  try {
    // Get document ID and updated data from the request body
    const updatedData = req.body;
    const { id } = req.params;
    await UpdateMainData(updatedData, id, 0);
    await UpdateBranchData(id, updatedData);
    // Respond with a success message
    res.status(200).json({ message: "Expense document edited successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = updateBranchName;
