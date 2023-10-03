const admin = require("../../../config/firebase-admin");
// Function to set SuperAdmin custom claim
const grantSuperAdminAccess = async (uid) => {
  const customClaims = {
    superAdmin: true,
  };

  try {
    await admin.auth().setCustomUserClaims(uid, customClaims);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = grantSuperAdminAccess;
