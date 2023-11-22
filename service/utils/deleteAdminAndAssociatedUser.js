const deleteDocument = require("../mainCRUD/deleteDoc");
const popArrayElement = require("./popArrayElementFromObject");
const updateOrCreateFieldsInDocument = require("./updateOrCreateFieldsInDocument");

const deleteAdminAndAssociatedUserInfo = async (db, batch, id) => {
  try {
    await deleteDocument(db, batch, "admin", id);
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
  } catch (error) {
    console.error("Error deleting admin and associated user:", error);
    throw error;
  }
};

module.exports = deleteAdminAndAssociatedUserInfo;
