const deleteBranchAndUpdateDashboard = require("../../service/branches/dashBoard/deleteBranchDashboard");
const deleteFieldFromDashboardDataBranch = require("../../service/branches/dashBoard/deleteFieldFromDashboardDataBranch");
const deleteBranchRelatedDoc = require("../../service/branches/deleteBranchRelatedDoc");
const deleteDocument = require("../../service/mainCRUD/deleteDoc");
const editUserDisplayName = require("../../service/users/firebaseAuth/editUserDisplayName");
const deleteField = require("../../service/utils/deleteField");
const getDocumentDataById = require("../../service/utils/getDocumentDataById");
const updateOrCreateFieldsInDocument = require("../../service/utils/updateOrCreateFieldsInDocument");
const admin = require("../../config/firebase-admin");

const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

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
      await updateOrCreateFieldsInDocument(
        db,
        batch,
        "admin",
        branchData.managerId,
        {
          branchName: "",
          branchId: "",
        }
      );
    }
    // console.log(mane);
    // Commit the batch
    await batch.commit();

    res.status(200).json({ message: "Branch document deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteBranch;
