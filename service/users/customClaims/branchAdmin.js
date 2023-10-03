const admin = require("../../../config/firebase-admin");
// Function to grant Admin custom claim

const grantAdminAccess = async (uid) => {
  try {
    const customClaims = {
      admin: true,
    };

    await admin.auth().setCustomUserClaims(uid, customClaims);
    console.log("Admin access granted successfully!");
  } catch (error) {
    console.error("Error granting Admin access:", error);
    throw Error(error);
  }
};

module.exports = grantAdminAccess;
