// Import required modules
const admin = require("../config/firebase-admin");
const { v4: UUID } = require("uuid");
const parseForm = require("../utils/formParser");
const { createUserAndGrantAdminAccess } = require("../utils/userManagement");
const uploadProfileImage = require("../utils/imageUploader");
const createUserDocument = require("../utils/createUserDocument");
const updateOrCreateDocument = require("../utils/updateOrCreateDocument");
// Main function to create admin data
const createAdminData = async (req, res) => {
  try {
    const { fields, files } = await parseForm(req);

    let uuid = UUID();

    const uid = await createUserAndGrantAdminAccess(
      fields.email,
      fields.branch
    );

    const imageUrl = await uploadProfileImage(
      files.profileImage,
      uuid,
      "admin"
    );

    // await updateOrCreateDocument(
    //   "branches",
    //   fields.branch,
    //   "manager",
    //   fields.fullName
    // );
    console.log(imageUrl);
    console.log(fields);
    // await createUserDocument(uid, fields, imageUrl, "admin");

    res.status(200).json({ message: "User registration successful!" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateAdminData = async (req, res) => {
  try {
    const { id } = req.params;

    const data = req.body;

    await admin.firestore().collection("admin").doc(id).update(data);
    res.status(200).json({ message: "Data updated successfully." });
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
    await admin.firestore().collection("admin").doc(id).update(data);
    res.status(200).json({ message: "Data updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteAdminData = async (req, res) => {
  try {
    const { id, branchId } = req.params;
    console.log(id);
    await admin.firestore().collection("admin").doc(id).delete();
    await admin.auth().deleteUser(id);
    await updateOrCreateDocument("branches", branchId, "manager", "");
    res.status(200).json({ message: "Data deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const disableUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    console.log(id);
    console.log(data);
    const userRecord = await admin
      .auth()
      .updateUser(id, { disabled: data.disable });
    await updateOrCreateDocument("admin", id, "disable", data.disable);
    if (userRecord.disabled) {
      // Log the user out
      await admin.auth().revokeRefreshTokens(id);
    }
    res.status(200).json({ message: "Data updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Export the controller functions
module.exports = {
  createAdminData,
  updateAdminData,
  deleteAdminData,
  updateProfilePicture,
  disableUser,
};
