// Import required modules
const admin = require("../config/firebase-admin");
const { v4: UUID } = require("uuid");
const parseForm = require("../utils/formParser");
const { createUserAndGrantFinanceAccess } = require("../utils/userManagement");
const uploadProfileImage = require("../utils/imageUploader");
const createUserDocument = require("../utils/createUserDocument");

async function createBankCollection(id) {
  const deliveryTurnCollectionRef = db.collection("Bank").doc(id);
  const deliveryTurnDocumentSnapshot = await deliveryTurnCollectionRef.get();

  if (!deliveryTurnDocumentSnapshot.exists) {
    return deliveryTurnCollectionRef.set({
      withdrawal: 0,
      deposit: 0,
      total: 0,
    });
  }
}

const createFinance = async (req, res) => {
  try {
    const { fields, files } = await parseForm(req);

    let uuid = UUID();

    const uid = await createUserAndGrantFinanceAccess(fields.email);

    const imageUrl = await uploadProfileImage(
      files.profileImage,
      uuid,
      "finance"
    );
    await createUserDocument(uid, fields, imageUrl, "finance");
    await createBankCollection(uid);
    const formData = {
      200: 0,
      100: 0,
      50: 0,
      10: 0,
      5: 0,
      1: 0,
      sum: 0,
      actual: 0,
      balance: 0,
      totalCredit: 0,
      active: uid,
      openingDate: new Date(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await admin.firestore().collection("Calculator").doc(uid).set(formData);

    res.status(200).json({ message: "User registration successful!" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;
    const { fields, files } = await parseForm(req);

    let uuid = UUID();

    const imageUrl = await uploadProfileImage(
      files.profileImage,
      uuid,
      "admin"
    );

    data = {
      profileImage: imageUrl,
    };

    // console.log("data", data);
    await admin.firestore().collection("finance").doc(id).update(data);
    res.status(200).json({ message: "Data updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateFinance = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    console.log(req.body);
    const data = req.body;
    await admin.firestore().collection("finance").doc(id).update(data);
    res.status(200).json({ message: "Finance updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteFinance = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    await admin.firestore().collection("finance").doc(id).delete();
    res.status(200).json({ message: "Finance deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFinance,
  updateFinance,
  deleteFinance,
  updateProfilePicture,
};
