const admin = require("../../../config/firebase-admin");

const updateDashboard = require("../../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../../service/credit/dashboard/updateDashboardBranchInfo");
const updateSalaryTable = require("../../../service/credit/updateSalaryTable/updateSalaryTable");
const updateSheetStatus = require("../../../service/credit/updateSheetStatus/updateSheetStatus");
const createDocumentWithCustomId = require("../../../service/mainCRUD/createDocumentWithCustomId");
const deleteDocument = require("../../../service/mainCRUD/deleteDoc");
const editDocument = require("../../../service/mainCRUD/editDoc");
const editUserDisplayName = require("../../../service/users/firebaseAuth/editUserDisplayName");
const editUserEmail = require("../../../service/users/firebaseAuth/editUserEmail");
const revokeRefreshTokens = require("../../../service/users/firebaseAuth/revokeRefreshTokens");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const popArrayElement = require("../../../service/utils/popArrayElementFromObject");
const pushToFieldArray = require("../../../service/utils/pushToFieldArray");
const updateFieldsInNestedObject = require("../../../service/utils/updateFieldsInNestedObject");
const updateOrCreateFieldsInDocument = require("../../../service/utils/updateOrCreateFieldsInDocument");
// const admin = require("../../../config/firebase-admin"); // Import Firebase Admin
/**
 * Edit an admin document in the "admin" Firestore collection.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 * @throws {Error} Throws an error if the operation fails.
 */
const editAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    // Step 1: Get document ID and updated data from the request body
    const {
      branchIdChange,
      oldBranchId,
      addressChange,
      phoneChange,
      nameChange,
      emailChange,
      salaryChange,
      ...updatedData
    } = req.body;

    // Step 2: Retrieve the current admin data by ID
    if (branchIdChange && updatedData.active) {
      // Step 3: If branch change and admin is active, return an error message
      return res.status(400).json({
        message: `You cannot change the branch admin for ${updatedData.branchName} at the moment, as they are already included in the salary table. Please wait until the current 15-day pay period concludes.`,
        type: "info",
      });
    }

    // Create Firestore database and batch
    const db = admin.firestore();
    const batch = db.batch();
    // Step 4: Edit the admin document in the "admin" collection
    await editDocument(db, batch, "admin", id, updatedData);

    // Step 5: If name is changed, push to the "ashamStaff" array
    if (nameChange && updatedData.active) {
      await pushToFieldArray(db, batch, "ashamStaff", "ashamStaff", "member", {
        id: id,
        name: updatedData.fullName,
        role: "BranchAdmin",
        branch: "Asham",
      });

      await updateFieldsInNestedObject(
        db,
        batch,
        "staffSalary",
        updatedData.active,
        id,
        {
          name: updatedData.fullName,
          uniqueName: "Admin",
        }
      );
    }

    // Step 6: If phone, name, or address is changed, update the "Essentials" document
    if (phoneChange || nameChange || addressChange) {
      await editDocument(db, batch, "Essentials", id, {
        name: updatedData.fullName,
        address: updatedData.fullAddress,
        phone: updatedData.phone,
      });
    }

    // Step 7: If salary is changed and admin is active, update salary-related data
    if (salaryChange && updatedData.active) {
      // Update Salary table
      const salaryUpdate = {
        fixedSalary: parseFloat(updatedData.difference),
        total: parseFloat(updatedData.difference),
      };

      const newSalaryTable = await updateSalaryTable(
        "staffSalary",
        updatedData.active,
        id,
        "total",
        salaryUpdate,
        db,
        batch
      );

      // Determine the SalaryType based on placement

      // Update sheet status with new SalaryType value
      const newStatus = await updateSheetStatus(
        updatedData.active,
        "totalStaffSalary",
        newSalaryTable.total.total + parseFloat(updatedData.difference),
        db,
        batch
      );

      // Update the dashboard with the new status
      await updateDashboard(
        db,
        batch,
        updatedData.branchId,
        newStatus.totalExpense
      );

      // Update dashboard branch info with the new status
      await updateDashboardBranchInfo(
        db,
        batch,
        updatedData.branchId,
        newStatus.totalExpense
      );
    }

    // Step 9: If branchId is changed, update or create fields in "branches" documents
    if (branchIdChange) {
      // Update or create fields in "branches" document for the old branchId
      await updateOrCreateFieldsInDocument(db, batch, "branches", oldBranchId, {
        manager: "not assigned",
        managerId: "not assigned",
      });

      // Remove admin from "worker" array in the old branchId

      if (oldBranchId) {
        await popArrayElement(
          "worker",
          { id: id },
          oldBranchId,
          "branches",
          db,
          batch
        );
      }
    }

    // Step 10: Update or create fields in the "branches" document for the new branchId
    await updateOrCreateFieldsInDocument(
      db,
      batch,
      "branches",
      updatedData.branchId,
      {
        manager: updatedData.fullName,
        managerId: id,
      }
    );

    // Push admin to "worker" array in the new branchId
    await pushToFieldArray(
      db,
      batch,
      "branches",
      updatedData.branchId,
      "worker",
      {
        id: id,
        name: updatedData.fullName,
        role: "BranchAdmin",
      }
    );
    // print(man);
    // Step 11: Edit the "staff" document with the updated data
    await editDocument(db, batch, "staff", id, updatedData);
    await batch.commit();
    // Step 8: If email is changed, update the user's email
    if (emailChange) {
      await editUserDisplayName(id, updatedData.branchId);
      await editUserEmail(id, updatedData.email);
      await revokeRefreshTokens(id);
    }
    // Step 12: Respond with a success message
    res.status(200).json({ message: "Admin document edited successfully." });
  } catch (error) {
    // Step 13: Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
    const user = await getDocumentDataById("admin", id);
    await editUserEmail(id, user.email);
  }
};

module.exports = editAdmin;
