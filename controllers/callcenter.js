// Import required modules
const admin = require("../config/firebase-admin");
const { v4: UUID } = require("uuid");
const parseForm = require("../utils/formParser");
const {
  createUserAndGrantCallCenterAccess,
} = require("../utils/userManagement");
const uploadProfileImage = require("../utils/imageUploader");
const createUserDocument = require("../utils/createUserDocument");

// Main function to create admin data
const createCallCenterData = async (req, res) => {
  try {
    const { fields, files } = await parseForm(req);

    let uuid = UUID();

    const uid = await createUserAndGrantCallCenterAccess(fields.email);

    const imageUrl = await uploadProfileImage(
      files.profileImage,
      uuid,
      "callcenter"
    );
    console.log("fields", fields);
    await createUserDocument(uid, fields, imageUrl, "callcenter");

    res.status(200).json({ message: "User registration successful!" });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const updateCallCenterData = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await admin.firestore().collection("callcenter").doc(id).update(data);
    res.status(200).json({ message: "Callcenter updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
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
    await admin.firestore().collection("callcenter").doc(id).update(data);
    res.status(200).json({ message: "Data updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteCallCenterData = async (req, res) => {
  try {
    const { id } = req.params;
    await admin.firestore().collection("callcenter").doc(id).delete();
    res.status(200).json({ message: "Callcenter deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Export the controller functions
module.exports = {
  createCallCenterData,
  updateCallCenterData,
  deleteCallCenterData,
  updateProfilePicture,
};
