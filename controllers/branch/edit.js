const admin = require("../../config/firebase-admin");
const UpdateMainData = require("../../service/branches/dashBoard/dashboardNamechange");

const fetchAndUpdateBranchData = require("../../service/branches/dashBoard/fetchAndUpdateBranchData");
const fetchAndUpdateMainData = require("../../service/branches/dashBoard/fetchAndUpdateMainData");
const UpdateBranchData = require("../../service/branches/dashBoard/nameChange");
const updateDashboard = require("../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../service/credit/dashboard/updateDashboardBranchInfo");
const editDocument = require("../../service/mainCRUD/editDoc");
const updateStatusAndTotalExpense = require("../../service/sheet/updateStatusAndTotalExpense");
const updateStatusDocument = require("../../service/sheet/updateStatusDocument");
const getDocumentDataById = require("../../service/utils/getDocumentDataById");
const updateOrCreateFieldsInDocument = require("../../service/utils/updateOrCreateFieldsInDocument");

const editBranch = async (req, res) => {
  try {
    // Step 1: Get the updated data and document ID from the request body

    const { difference, budgetChange, nameChange, ...updatedData } = req.body;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message:
          "Branch information is missing.Please refresh your browser and try again.",
      });
    }
    if (!updatedData) {
      return res
        .status(400)
        .json({ message: "Updated data is missing or empty." });
    }

    const expenses = ["ExpenseOne", "ExpenseTwo", "ExpenseThree"];

    for (const expense of expenses) {
      const amountKey = `${expense}Amount`;
      const nameKey = `${expense}Name`;

      if (updatedData[amountKey] === 0 || updatedData[amountKey] === "") {
        updatedData[nameKey] = "";
      }
    }
    // Initialize Firestore database and create a batch
    const db = admin.firestore();
    const batch = db.batch();

    // Step 2: Update the branch document in the "branches" collection within the batch
    const branchRef = db.collection("branches").doc(id);
    batch.update(branchRef, updatedData);

    // Step 3: Fetch and update branch-related data

    // Step 5: If the branch is active, update status data and total expense
    if (updatedData.active) {
      const statusData = await getDocumentDataById(
        "Status",
        updatedData.active
      );

      // Step 6: Calculate and update status data with new branch data
      if (!statusData) {
        return res.status(400).json({
          message:
            "Branch sheet information is missing.Please refresh your browser and try again.",
        });
      }

      const updatedStatusData = updateStatusAndTotalExpense(
        statusData,
        updatedData
      );
      if (!updatedStatusData) {
        return res.status(400).json({
          message:
            "Branch sheet information is missing.Please refresh your browser and try again.",
        });
      }

      const newStatus = await updateStatusDocument(
        db,
        batch,
        updatedData.active,
        updatedStatusData
      );

      if (!newStatus) {
        return res.status(400).json({
          message:
            "Branch sheet status information is missing.Please refresh your browser and try again.",
        });
      }
      // Update the dashboard with the new status
      await updateDashboard(
        db,
        batch,
        id,
        newStatus.totalExpense ? newStatus.totalExpense : 0,
        updatedData,
        difference ? difference : 0
      );
      // Update dashboard branch info with the new status
      await updateDashboardBranchInfo(
        db,
        batch,
        id,
        newStatus.totalExpense ? newStatus.totalExpense : 0,
        updatedData
      );
      // console.log(man);
    }

    if (updatedData.managerId !== "not assigned") {
      await updateOrCreateFieldsInDocument(
        db,
        batch,
        "admin",
        updatedData.managerId,
        {
          branchName: updatedData.name,
        }
      );
    }

    // console.log(man);

    await fetchAndUpdateBranchData(db, batch, id, updatedData);
    await fetchAndUpdateMainData(
      db,
      batch,
      updatedData,
      id,
      difference ? difference : 0
    );
    await editDocument(db, batch, "Budget", id, {
      budget: updatedData.budget,
    });
    // Commit the batch
    await batch.commit();
    // Step 7: Respond with a success message
    res.status(200).json({ message: "Branch document edited successfully." });
  } catch (error) {
    // Step 8: Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = editBranch;
