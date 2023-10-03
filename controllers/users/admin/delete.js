const deleteDocument = require("../../../service/mainCRUD/deleteDoc");
const deleteUser = require("../../../service/users/firebaseAuth/deleteUser");
const deleteId1FieldAndReduceTotal = require("../../../service/utils/deleteId1FieldAndReduceTotal");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const popArrayElement = require("../../../service/utils/popArrayElementFromObject");
const updateOrCreateFieldsInDocument = require("../../../service/utils/updateOrCreateFieldsInDocument");
const admin = require("../../../config/firebase-admin"); // Import Firebase Admin
const disableUserAccount = require("../../../service/users/firebaseAuth/disableUser");
const revokeRefreshTokens = require("../../../service/users/firebaseAuth/revokeRefreshTokens");

/**
 * Delete an admin document from the "admin" Firestore collection.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 * @throws {Error} Throws an error if the operation fails.
 */
const deleteAdmin = async (req, res) => {
  try {
    // Step 1: Get document ID from the request parameters
    const { id } = req.params;

    // Step 2: Retrieve admin data by ID
    const adminData = await getDocumentDataById("admin", id);

    // Create Firestore database and batch
    const db = admin.firestore();
    const batch = db.batch();

    // Step 3: Delete the admin document from the "admin" collection
    await deleteDocument(db, batch, "admin", id);

    // Step 4: Delete the user associated with the admin

    // Step 5: Update or create fields in the "branches" document for the old branch
    await updateOrCreateFieldsInDocument(
      db,
      batch,
      "branches",
      adminData.branchId,
      {
        manager: "not assigned",
        managerId: "not assigned",
      }
    );
    // Step 6: Delete the corresponding "staff" document
    await deleteDocument(db, batch, "staff", id);
    await deleteDocument(db, batch, "Essentials", id);
    await popArrayElement(
      "member",
      { id: id },
      "ashamStaff",
      "ashamStaff",
      db,
      batch
    );
    await popArrayElement(
      "worker",
      { id: id },
      adminData.branchId,
      "branches",
      db,
      batch
    );
    const branchData = await getDocumentDataById(
      "branches",
      adminData.branchId
    );
    if (branchData && branchData.active) {
      await deleteId1FieldAndReduceTotal(branchData.active, id, db, batch);
    }

    // Step 4: Update or create the "disable" field in the specified Firestore collection document
    await updateOrCreateFieldsInDocument(db, batch, collectionName, id, {
      disable: true,
    });
    // Step 2: Disable or enable the user account in Firebase Authentication
    await disableUserAccount(id, true);
    // Step 3: If disabled, revoke the user's refresh tokens
    await revokeRefreshTokens(id);
    await deleteUser(id);
    await batch.commit();
    // Step 7: Respond with a success message
    res.status(200).json({ message: "Admin document deleted successfully." });
  } catch (error) {
    // Step 8: Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteAdmin;