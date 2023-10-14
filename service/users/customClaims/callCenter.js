const admin = require("../../../config/firebase-admin");

// Function to grant Call Center custom claim
const grantCallCenterAccess = async (uid) => {
  try {
    const customClaims = {
      callCenter: true,
    };

    await admin.auth().setCustomUserClaims(uid, customClaims);
    console.log("Call Center access granted successfully!");
  } catch (error) {
    console.error("Error granting Call Center access:", error);
    throw error;
  }
};

module.exports = grantCallCenterAccess;
