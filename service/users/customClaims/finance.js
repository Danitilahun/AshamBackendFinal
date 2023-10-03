const admin = require("../../../config/firebase-admin");
//  Function to grant Finance custom claim
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

module.exports = grantFinanceAccess;
