const { v4: UUID } = require("uuid");
const parseForm = require("../../../util/formParser");
const createUser = require("../../../service/users/firebaseAuth/createUser");
const grantAdminAccess = require("../../../service/users/customClaims/branchAdmin");
const uploadProfileImage = require("../../../util/uploadProfileImage");
const createUserDocument = require("../../../service/users/userManagement/create");
const updateOrCreateFieldsInDocument = require("../../../service/utils/updateOrCreateFieldsInDocument");
const pushToFieldArray = require("../../../service/utils/pushToFieldArray");
const getStaffSalaryData = require("../../../util/getStaffSalaryData");
const addStaffToTable = require("../../../service/users/updateTables/addStaffToTable");
const updateDashboardTotalEmployees = require("../../../service/users/updateDashboard/updateEmployeCount");
const incrementFieldByOne = require("../../../service/utils/incrementFieldByOne");
const updateSheetStatus = require("../../../service/credit/updateSheetStatus/updateSheetStatus");
const updateDashboard = require("../../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../../service/credit/dashboard/updateDashboardBranchInfo");
const admin = require("../../../config/firebase-admin"); // Import Firebase Admin
/**
 * Create admin data by processing a request.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} A JSON response indicating the result of the operation.
 */
const createStaff = async (req, res) => {
  // Create Firestore database and batch
  const db = admin.firestore();
  const batch = db.batch();
  try {
    // Step 1: Parse form data from the request
    const { fields, files } = await parseForm(req);

    if (!fields) {
      return res.status(400).json({
        message: "Invalid request data",
        type: "error",
      });
    }

    fields.salary = parseInt(fields.salary);
    console.log(fields);
    // Step 2: Generate a unique identifier (UUID)
    let uuid = UUID();

    if (fields.active) {
      const Work = getStaffSalaryData(fields.salary);
      Work.name = fields.fullName;
      Work.uniqueName = fields.uniqueName;
      const newSalaryTable = await addStaffToTable(
        db,
        batch,
        "staffSalary",
        fields.active,
        {
          [uuid]: Work,
        },
        parseInt(fields.salary)
      );

      const newStatus = await updateSheetStatus(
        fields.active,
        "totalStaffSalary",
        newSalaryTable.total.total,
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
    // Step 3: Create a user with Firebase Auth

    // Step 5: Upload the profile image and get the image URL
    const imageUrl = await uploadProfileImage(
      files.profileImage,
      uuid,
      "staff"
    );
    fields.paid = true;
    fields.staffCredit = 0;
    console.log(fields);
    // Step 7: Create user documents for the admin and staff roles
    await createUserDocument(uuid, fields, imageUrl, "staff", db, batch);
    await pushToFieldArray(db, batch, "branches", fields.branchId, "worker", {
      id: uuid,
      name: fields.fullName,
      role: fields.role,
    });

    await incrementFieldByOne(
      "branches",
      fields.branchId,
      "numberofworker",
      1,
      db,
      batch
    );

    // Commit the batch updates
    await batch.commit();

    // Step 8: Send a success response
    res.status(200).json({ message: "staff registration successful!" });
  } catch (error) {
    // Handle errors and send an error response
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = createStaff;
