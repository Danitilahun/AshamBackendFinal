const { v4: UUID } = require("uuid");
const parseForm = require("../../../util/formParser");
const uploadProfileImage = require("../../../util/uploadProfileImage");
const createUserDocument = require("../../../service/users/userManagement/create");
const getDeliveryGuyWorkData = require("../../../util/getDeliveryGuyWorkData");
const addDeliveryGuyToTable = require("../../../service/users/updateTables/addDeliveryGuyToTable");
const getDeliveryGuySalaryData = require("../../../util/getDeliveryGuySalaryData");
const incrementFieldByOne = require("../../../service/utils/incrementFieldByOne");
const pushToFieldArray = require("../../../service/utils/pushToFieldArray");
const updateDashboardTotalEmployees = require("../../../service/users/updateDashboard/updateEmployeCount");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const admin = require("../../../config/firebase-admin"); // Import Firebase Admin
/**
 * Create delivery guy data by processing a request.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} A JSON response indicating the result of the operation.
 */

const createDeliveryGuy = async (req, res) => {
  try {
    // Step 1: Parse form data from the request
    const { fields, files } = await parseForm(req);

    console.log(fields);
    // Step 2: Generate a unique identifier (UUID)
    let uuid = UUID();

    const { activeTable, active, ...data } = fields;

    // Create Firestore database and batch
    const db = admin.firestore();
    const batch = db.batch();

    // Step 3: Prepare data for Work and Salary collections

    const Work = getDeliveryGuyWorkData();
    Work.name = fields.fullName;
    Work.uniqueName = fields.uniqueName;

    const salary = getDeliveryGuySalaryData();
    salary.name = fields.fullName;
    salary.uniqueName = fields.uniqueName;

    // Step 4: Add Work data to specified tables if activeTable is provided
    if (activeTable) {
      await addDeliveryGuyToTable(
        "tables",
        activeTable,
        {
          [uuid]: Work,
        },
        db,
        batch
      );
    }

    // Step 5: Add Work and Salary data to specified tables if active is provided
    if (active) {
      await addDeliveryGuyToTable(
        "tables",
        active,
        {
          [uuid]: Work,
        },
        db,
        batch
      );
      await addDeliveryGuyToTable(
        "salary",
        fields.active,
        {
          [uuid]: salary,
        },
        db,
        batch
      );
    }

    // Step 6: Upload the profile image and get the image URL
    const imageUrl = await uploadProfileImage(
      files.profileImage,
      uuid,
      "deliveryguy"
    );
    fields.activeness = false;
    fields.paid = true;
    fields.waiting = false;
    fields.dailyCredit = 0;

    fields.staffCredit = 0;
    delete fields.activeTable;
    delete fields.active;

    const branchData = await getDocumentDataById("branches", fields.branchId);
    fields.uniqueName =
      branchData.uniqueName + `D-${branchData.numberofworker + 1}`;
    // Step 7: Create user documents for the delivery guy
    await createUserDocument(uuid, fields, imageUrl, "deliveryguy", db, batch);

    // Step 8: Increment the number of workers in the branch
    await incrementFieldByOne(
      "branches",
      data.branchId,
      "numberofworker",
      1,
      db,
      batch
    );

    // Step 9: Add the delivery guy to the worker list in the branch
    await pushToFieldArray(db, batch, "branches", data.branchId, "worker", {
      id: uuid,
      name: data.fullName,
      role: "DeliveryGuy",
    });

    // Step 10: Update the totalEmployees count in the dashboard
    await updateDashboardTotalEmployees(1, db, batch);

    // Commit the batch updates
    // console.log(man);
    await batch.commit();
    // Step 11: Send a success response
    res.status(200).json({ message: "Delivery guy registration successful!" });
  } catch (error) {
    // Step 12: Handle errors and send an error response
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = createDeliveryGuy;
