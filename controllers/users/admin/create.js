const { v4: UUID } = require("uuid");
const parseForm = require("../../../util/formParser");
const createUser = require("../../../service/users/firebaseAuth/createUser");
const grantAdminAccess = require("../../../service/users/customClaims/branchAdmin");
const uploadProfileImage = require("../../../util/uploadProfileImage");
const createUserDocument = require("../../../service/users/userManagement/create");
const updateOrCreateFieldsInDocument = require("../../../service/utils/updateOrCreateFieldsInDocument");
const pushToFieldArray = require("../../../service/utils/pushToFieldArray");
const createDocument = require("../../../service/mainCRUD/createDoc");
const createDocumentWithCustomId = require("../../../service/mainCRUD/createDocumentWithCustomId");
const getStaffSalaryData = require("../../../util/getStaffSalaryData");
const addStaffToTable = require("../../../service/users/updateTables/addStaffToTable");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const updateSheetStatus = require("../../../service/credit/updateSheetStatus/updateSheetStatus");
const updateDashboard = require("../../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../../service/credit/dashboard/updateDashboardBranchInfo");
const admin = require("../../../config/firebase-admin"); // Import Firebase Admin
const deleteUser = require("../../../service/users/firebaseAuth/deleteUser");
/**
 * Create admin data by processing a request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} A JSON response indicating the result of the operation.
 */

const createAdmin = async (req, res) => {
  let uid;
  try {
    // Step 1: Parse form data from the request
    const { fields, files } = await parseForm(req);
    fields.salary = parseInt(fields.salary);

    // Check if 'fields' is null
    if (!fields) {
      return res.status(400).json({
        message: "Invalid request data",
        type: "error",
      });
    }

    // Step 2: Generate a unique identifier (UUID)
    let uuid = UUID();

    // Step 3: Create a user with Firebase Auth
    uid = await createUser(fields.email, fields.branchId);
    fields.uniqueName = "Admin";
    // Step 4: Grant admin access to the user
    await grantAdminAccess(uid);

    // Step 5: Upload the profile image and get the image URL
    const imageUrl = await uploadProfileImage(
      files.profileImage,
      uuid,
      "admin"
    );

    // Create Firestore database and batch
    const db = admin.firestore();
    const batch = db.batch();

    // Step 6: Update or create fields in the "branches" document (using batch)
    await updateOrCreateFieldsInDocument(
      db,
      batch,
      "branches",
      fields.branchId,
      {
        manager: fields.fullName,
        managerId: uid,
      }
    );

    // Step 7: Create user documents for the admin and staff roles (using batch)
    await pushToFieldArray(db, batch, "branches", fields.branchId, "worker", {
      id: uid,
      name: fields.fullName,
      role: "BranchAdmin",
    });

    await pushToFieldArray(db, batch, "ashamStaff", "ashamStaff", "member", {
      id: uid,
      name: fields.fullName,
      role: "BranchAdmin",
      branch: "Asham",
    });

    if (fields.active) {
      const Work = getStaffSalaryData(fields.salary);
      Work.name = fields.fullName;
      Work.uniqueName = fields.uniqueName;

      // Update Salary table if the admin is active
      const newSalaryTable = await addStaffToTable(
        db,
        batch,
        "staffSalary",
        fields.active,
        {
          [uid]: Work,
        },
        parseFloat(fields.salary)
      );

      // Update sheet status with new SalaryType value
      const newStatus = await updateSheetStatus(
        fields.active,
        "totalStaffSalary",
        newSalaryTable.total.total + parseFloat(fields.salary),
        db,
        batch
      );

      // Update the dashboard with the new status
      await updateDashboard(db, batch, fields.branchId, newStatus.totalExpense);

      // Update dashboard branch info with the new status
      await updateDashboardBranchInfo(
        db,
        batch,
        fields.branchId,
        newStatus.totalExpense
      );
    }

    fields.disable = false;

    // Create user document for admin role
    await createUserDocument(uid, fields, imageUrl, "admin", db, batch);

    fields.paid = true;
    fields.staffCredit = 0;
    fields.salary = parseInt(fields.salary);
    fields.role = "BranchAdmin";
    fields.uniqueName = "Admin";

    // Create user document for staff role
    await createUserDocument(uid, fields, imageUrl, "staff", db, batch);

    // Create "Essentials" document (using batch)
    await createDocumentWithCustomId(
      "Essentials",
      uid,
      {
        name: fields.fullName,
        address: fields.fullAddress,
        phone: fields.phone,
        company: "Asham",
        sector: "Branch",
      },
      db,
      batch
    );

    // Commit the batch updates
    await batch.commit();

    // Step 8: Send a success response
    res.status(200).json({ message: "Admin registration successful!" });
  } catch (error) {
    // Step 9: Handle errors and send an error response
    console.error(error);
    res.status(500).json({
      message: error.message,
    });

    // Delete the user from Firebase Auth
    if (uid) {
      await deleteUser(uid);
    }
  }
};

module.exports = createAdmin;
