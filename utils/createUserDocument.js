const admin = require("../config/firebase-admin");
const createUserDocument = async (uid, fields, imageUrl, collection) => {
  const db = admin.firestore();

  try {
    const userDocumentData = {
      fullName: fields.fullName,
      phone: fields.phone,
      bankAccount: fields.bankAccount,
      fullAddress: fields.fullAddress,
      profileImage: imageUrl,
      securityName: fields.securityName,
      securityAddress: fields.securityAddress,
      securityPhone: fields.securityPhone,
    };

    // Conditionally set the email field if it is available in the fields object
    if (collection !== "callcenter" && collection !== "finance") {
      userDocumentData.branch = fields.branch;
    }
    if (collection !== "deliveryguy" && collection !== "staff") {
      userDocumentData.email = fields.email;
      userDocumentData.disable = false;
    } else {
      userDocumentData.activeness = false;
      userDocumentData.uniqueName = fields.uniqueName;
      userDocumentData.paid = true;
      userDocumentData.waiting = false;
      userDocumentData.dailyCredit = 0;
      userDocumentData.staffCredit = 0;
    }
    if (collection === "staff") {
      userDocumentData.role = fields.role;
      userDocumentData.salary = fields.salary;
      userDocumentData.paid = false;
      userDocumentData.staffCredit = 0;
    }
    if (collection === "finance") {
      userDocumentData.budget = fields.budget;
      userDocumentData.totalExpense = 0;
    }
    userDocumentData.openingDate = new Date();
    userDocumentData.createdAt = admin.firestore.FieldValue.serverTimestamp();
    await db.collection(collection).doc(uid).set(userDocumentData);
    console.log("User document successfully created!");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to register user.");
  }
};

module.exports = createUserDocument;
