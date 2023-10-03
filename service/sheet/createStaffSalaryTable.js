const admin = require("../../config/firebase-admin");
const getAllStaffByBranchId = require("../utils/getAllStaffByBranchId");
const getStaffToWorkMapping = require("../utils/getStaffToWorkMapping");
// /**
//  * Creates the staff salary table and adds it to the "staffSalary" collection.
//  * @param {string} customId1 - The custom ID 1.
//  * @param {string} sheetId - The sheet ID.
//  * @param {string} branchId - The branch ID.
//  * @returns {Promise<void>} A Promise that resolves when the staff salary table is created.
//  */
// const createStaffSalaryTable = async (customId1, sheetId, branchId) => {
//   if (!sheetId || !branchId) {
//     return null;
//   }

//   const staffs = await getAllStaffByBranchId("staff", branchId);
//   // Add "total" entry to staffs
//   staffs.push({ id: "total", uniqueName: "total", name: "total", salary: 0 });

//   const staffToWorkMappingSalary = await getStaffToWorkMapping(staffs);

//   staffToWorkMappingSalary["sheetId"] = sheetId;
//   staffToWorkMappingSalary["branchId"] = branchId;

//   await admin
//     .firestore()
//     .collection("staffSalary")
//     .doc(customId1)
//     .set(staffToWorkMappingSalary);

//   return staffToWorkMappingSalary.total.total;
// };

// module.exports = createStaffSalaryTable;

/**
 * Creates the staff salary table and adds it to the "staffSalary" collection.
 * @param {string} customId1 - The custom ID 1.
 * @param {string} sheetId - The sheet ID.
 * @param {string} branchId - The branch ID.
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @returns {Promise<number>} A Promise that resolves with the total staff salary when the staff salary table is created.
 */
const createStaffSalaryTable = async (
  customId1,
  sheetId,
  branchId,
  db,
  batch
) => {
  if (!sheetId || !branchId) {
    return null;
  }

  const staffs = await getAllStaffByBranchId("staff", branchId);
  // Add "total" entry to staffs
  staffs.push({ id: "total", uniqueName: "total", name: "total", salary: 0 });

  const staffToWorkMappingSalary = await getStaffToWorkMapping(staffs);

  staffToWorkMappingSalary["sheetId"] = sheetId;
  staffToWorkMappingSalary["branchId"] = branchId;

  // Get the document reference
  const documentRef = db.collection("staffSalary").doc(customId1);

  // Add the set operation to the batch
  batch.set(documentRef, staffToWorkMappingSalary);

  return staffToWorkMappingSalary.total.total;
};

module.exports = createStaffSalaryTable;
