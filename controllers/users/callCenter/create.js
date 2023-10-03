const { v4: UUID } = require("uuid");
const parseForm = require("../../../util/formParser");
const createUser = require("../../../service/users/firebaseAuth/createUser");
const uploadProfileImage = require("../../../util/uploadProfileImage");
const createUserDocument = require("../../../service/users/userManagement/create");
const pushToFieldArray = require("../../../service/utils/pushToFieldArray");
const grantCallCenterAccess = require("../../../service/users/customClaims/callCenter");
// Main function to create admin data
const admin = require("../../../config/firebase-admin"); // Import Firebase Admin
const deleteUser = require("../../../service/users/firebaseAuth/deleteUser");
const createCallCenterData = async (req, res) => {
  // Create Firestore database and batch
  const db = admin.firestore();
  const batch = db.batch();

  let uid;

  try {
    const { fields, files } = await parseForm(req);

    let uuid = UUID();

    if (!fields) {
      return res.status(400).json({
        message: "Invalid request data",
        type: "error",
      });
    }

    uid = await createUser(fields.email);
    await grantCallCenterAccess(uid);

    const imageUrl = await uploadProfileImage(
      files.profileImage,
      uuid,
      "callcenter"
    );
    fields.disable = false;
    await createUserDocument(uid, fields, imageUrl, "callcenter", db, batch);
    await pushToFieldArray(db, batch, "ashamStaff", "ashamStaff", "member", {
      id: uid,
      name: fields.fullName,
      role: "Callcenter",
      branch: "Asham",
    });

    // Commit the batch updates
    // console.log(man);
    await batch.commit();
    res.status(200).json({ message: "User registration successful!" });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });

    if (uid) {
      await deleteUser(uid);
    }
  }
};

module.exports = createCallCenterData;
