const admin = require("../config/firebase-admin");

const createCustomerData = (data, type) => {
  const customerData = {
    name: data.name || "",
    phone: data.phone || "",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    blockHouse: data.blockHouse || "",
    branchId: data.branchKey,
    branchName: data.branchName || "",
    createdDate: data.createdDate || "",
    type: type || "Asbeza",
  };

  return customerData;
};

module.exports = createCustomerData;
