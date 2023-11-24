const editDocument = require("../../../service/mainCRUD/editDoc");
const editUserEmail = require("../../../service/users/firebaseAuth/editUserEmail");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const pushToFieldArray = require("../../../service/utils/pushToFieldArray");
const admin = require("../../../config/firebase-admin"); // Import Firebase Admin

const editFinance = async (req, res) => {
  // Create Firestore database and batch
  const db = admin.firestore();
  const batch = db.batch();

  const { id } = req.params;
  try {
    const { emailChange, ...updatedData } = req.body;

    updatedData.salary = parseInt(updatedData.salary);
    await editDocument(db, batch, "finance", id, updatedData);
    await pushToFieldArray(db, batch, "ashamStaff", "ashamStaff", "member", {
      id: id,
      name: updatedData.fullName,
      role: "Finance",
      branch: "Asham",
    });

    await editDocument(db, batch, "Essentials", id, {
      name: updatedData.fullName,
      address: updatedData.fullAddress,
      phone: updatedData.phone,
    });
    // Commit the batch updates
    await batch.commit();
    if (emailChange) {
      await editUserEmail(id, updatedData.email);
    }
    res.status(200).json({ message: "Finance updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = editFinance;
