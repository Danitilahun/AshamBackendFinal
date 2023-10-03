const admin = require("firebase-admin");

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
  }
};

// Function to grant Finance custom claim
const grantFinanceAccess = async (uid) => {
  try {
    const customClaims = {
      finance: true,
    };

    await admin.auth().setCustomUserClaims(uid, customClaims);
    console.log("Finance access granted successfully!");
  } catch (error) {
    console.error("Error granting Finance access:", error);
  }
};

module.exports = {
  grantSuperAdminAccess,
  grantAdminAccess,
  grantCallCenterAccess,
  grantFinanceAccess,
};
