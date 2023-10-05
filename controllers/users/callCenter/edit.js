const editDocument = require("../../../service/mainCRUD/editDoc");
const editUserEmail = require("../../../service/users/firebaseAuth/editUserEmail");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const pushToFieldArray = require("../../../service/utils/pushToFieldArray");
const admin = require("../../../config/firebase-admin");

const editCallCenter = async (req, res) => {
  const db = admin.firestore();
  const { id } = req.params;
  const batch = db.batch();
  try {
    const { emailChange, ...updatedData } = req.body;

    await editDocument(db, batch, "callcenter", id, updatedData);
    await pushToFieldArray(db, batch, "ashamStaff", "ashamStaff", "member", {
      id: id,
      name: updatedData.fullName,
      role: "Callcenter",
      branch: "Asham",
    });

    await editDocument(db, batch, "Essentials", id, {
      name: updatedData.fullName,
      address: updatedData.fullAddress,
      phone: updatedData.phone,
    });

    if (emailChange) {
      await editUserEmail(id, updatedData.email);
    }
    // Commit the batch updates
    await batch.commit();
    res.status(200).json({ message: "Call Center updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
    const user = await getDocumentDataById("callcenter", id);
    await editUserEmail(id, user.email);
  }
};

module.exports = editCallCenter;
