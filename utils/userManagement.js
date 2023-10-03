// userManagement.js
const admin = require("../config/firebase-admin");
const firebaseUtils = require("./firebaseUtils"); // Import firebaseUtils if needed

const createUserAndGrantAdminAccess = async (email, id) => {
  try {
    console.log(email);
    const userRecord = await admin.auth().createUser({
      email,
      password: "12345678",
      displayName: id,
    });

    console.log(userRecord);
    const uid = userRecord.uid;
    console.log("Successfully created new user:", uid);

    await firebaseUtils.grantAdminAccess(uid);
    console.log("Successfully granted SuperAdmin access to user:", uid);

    return uid;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create user or grant SuperAdmin access.");
  }
};

const createUserAndGrantCallCenterAccess = async (email) => {
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password: "12345678", // Since we're sending a password reset link, set the password as an empty string
    });

    const uid = userRecord.uid;
    console.log("Successfully created new user:", uid);

    await firebaseUtils.grantCallCenterAccess(uid);
    console.log("Successfully granted SuperAdmin access to user:", uid);

    return uid;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create user or grant SuperAdmin access.");
  }
};

const createUserAndGrantFinanceAccess = async (email) => {
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password: "12345678", // Since we're sending a password reset link, set the password as an empty string
    });

    const uid = userRecord.uid;
    console.log("Successfully created new user:", uid);

    await firebaseUtils.grantFinanceAccess(uid);
    console.log("Successfully granted SuperAdmin access to user:", uid);

    return uid;
  } catch (err) {
    throw new Error("Failed to create user or grant SuperAdmin access.");
  }
};

module.exports = {
  createUserAndGrantAdminAccess,
  createUserAndGrantCallCenterAccess,
  createUserAndGrantFinanceAccess,
};
