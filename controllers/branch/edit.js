const admin = require("../../config/firebase-admin");

const fetchAndUpdateBranchData = require("../../service/branches/dashBoard/fetchAndUpdateBranchData");
const fetchAndUpdateMainData = require("../../service/branches/dashBoard/fetchAndUpdateMainData");
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
    // console.log("from the edit branch");
    // console.log(req.body);
    const { difference, budgetChange, nameChange, ...updatedData } = req.body;
    const { id } = req.params;

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

    if (!updatedData.active) {
      if (nameChange && !budgetChange) {
        await fetchAndUpdateBranchData(db, batch, id, updatedData);
        await fetchAndUpdateMainData(db, batch, updatedData, id, difference);
      } else {
        await fetchAndUpdateBranchData(db, batch, id, updatedData);
        await fetchAndUpdateMainData(db, batch, updatedData, id, difference);
        await editDocument(db, batch, "Budget", id, {
          budget: updatedData.budget,
        });
      }
    }

    // Step 5: If the branch is active, update status data and total expense
    if (updatedData.active) {
      const statusData = await getDocumentDataById(
        "Status",
        updatedData.active
      );

      console.log("the status data is", statusData);
      // Step 6: Calculate and update status data with new branch data
      const updatedStatusData = updateStatusAndTotalExpense(
        statusData,
        updatedData
      );
      const newStatus = await updateStatusDocument(
        db,
        batch,
        updatedData.active,
        updatedStatusData
      );

      // Update the dashboard with the new status
      await updateDashboard(
        db,
        batch,
        id,
        newStatus.totalExpense,
        updatedData,
        difference
      );
      // Update dashboard branch info with the new status
      await updateDashboardBranchInfo(
        db,
        batch,
        id,
        newStatus.totalExpense,
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
