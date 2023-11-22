const admin = require("../../config/firebase-admin");
const deleteBranchAndUpdateDashboard = require("../../service/branches/dashBoard/deleteBranchDashboard");
const deleteFieldFromDashboardDataBranch = require("../../service/branches/dashBoard/deleteFieldFromDashboardDataBranch");
const deleteBranchRelatedDoc = require("../../service/branches/deleteBranchRelatedDoc");
const deleteDocument = require("../../service/mainCRUD/deleteDoc");
const editUserDisplayName = require("../../service/users/firebaseAuth/editUserDisplayName");
const deleteField = require("../../service/utils/deleteField");
const getDocumentDataById = require("../../service/utils/getDocumentDataById");
const deleteAdminAndAssociatedUserInfo = require("../../service/utils/deleteAdminAndAssociatedUser");
const deleteUser = require("../../service/users/firebaseAuth/deleteUser");

const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message:
          "Branch information is missing.Please refresh your browser and try again.",
      });
    }
    const branchData = await getDocumentDataById("branches", id);
    if (!branchData) {
      return res.status(404).json({ message: "Branch not found." });
    }

    const db = admin.firestore();
    const batch = db.batch(); // Create a Firestore batch

    // Call the related functions with the batch parameter
    await deleteFieldFromDashboardDataBranch(db, batch, id);
    await deleteBranchAndUpdateDashboard(db, batch, id, branchData);
    await deleteBranchRelatedDoc(db, batch, id);
    await deleteField(db, batch, "Deliveryturn", "turnQueue", id);
    await deleteDocument(db, batch, "branches", id);
    await editUserDisplayName(branchData.managerId, "");

    if (branchData.managerId !== "not assigned") {
      await deleteAdminAndAssociatedUserInfo(db, batch, branchData.managerId);
      await deleteUser(id);
    }

    // Commit the batch
    await batch.commit();

    if (branchData.managerId !== "not assigned") {
      await deleteUser(id);
    }

    res.status(200).json({ message: "Branch document deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteBranch;
