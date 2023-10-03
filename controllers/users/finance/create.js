const { v4: UUID } = require("uuid");
const parseForm = require("../../../util/formParser");
const createUser = require("../../../service/users/firebaseAuth/createUser");
const uploadProfileImage = require("../../../util/uploadProfileImage");
const grantFinanceAccess = require("../../../service/users/customClaims/finance");
const createUserDocument = require("../../../service/users/userManagement/create");
const createBankCollection = require("../../../service/users/finance/createBankCollection");
const createCalculatorData = require("../../../service/users/finance/createCalculatorData");
const pushToFieldArray = require("../../../service/utils/pushToFieldArray");
const createTotalCreditCollection = require("../../../service/branches/createTotalCreditCollection");
const admin = require("../../../config/firebase-admin"); // Import Firebase Admin
const deleteUser = require("../../../service/users/firebaseAuth/deleteUser");
const createFinance = async (req, res) => {
  // Create Firestore database and batch
  const db = admin.firestore();
  const batch = db.batch();
  let uid;
  try {
    const { fields, files } = await parseForm(req);
    let uuid = UUID();
    uid = await createUser(fields.email);
    await grantFinanceAccess(uid);
    const imageUrl = await uploadProfileImage(
      files.profileImage,
      uuid,
      "finance"
    );
    fields.disable = false;
    fields.totalExpense = 0;
    fields.salary = parseInt(fields.salary);
    fields.budget = parseInt(fields.budget);
    fields.BudgetSummery = 0;
    fields.credit = 0;
    fields.balance = 0;
    await createUserDocument(uid, fields, imageUrl, "finance", db, batch);
    // console.log("fields", fields);
    await createBankCollection(db, batch, uid);
    await createCalculatorData(uid, db, batch);
    await createTotalCreditCollection(db, batch, uid);
    await pushToFieldArray(db, batch, "ashamStaff", "ashamStaff", "member", {
      id: uid,
      name: fields.fullName,
      role: "Finance",
      branch: "Asham",
    });

    // Commit the batch updates
    await batch.commit();

    res.status(200).json({ message: "User registration successful!" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
    if (uid) {
      await deleteUser(uid);
    }
  }
};

module.exports = createFinance;
