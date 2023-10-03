const admin = require("../config/firebase-admin");
const getDocumentById = require("../utils/getDocumentById");
const pushToFieldArray = require("../utils/pushToFieldArray");
const updateBankTransaction = require("../utils/updateBankTransaction");

// async function createBankCollection(id) {
//   const deliveryTurnCollectionRef = db.collection("Bank").doc(id);
//   const deliveryTurnDocumentSnapshot = await deliveryTurnCollectionRef.get();
//   if (!deliveryTurnDocumentSnapshot.exists) {
//     return deliveryTurnCollectionRef.set({
//       withdrawal: 0,
//       deposit: 0,
//       total: 0,
//     });
//   }
// }

const CreateBank = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const db = admin.firestore();
    const branchesCollection = db.collection("Bank");
    console.log(data.transaction === "withdrawal");
    data.amount =
      data.transaction === "withdrawal" ? -data.amount : data.amount;
    data.openingDate = new Date();
    data.createdAt = admin.firestore.FieldValue.serverTimestamp();
    await branchesCollection.add(data);
    // await updateBankTransaction(
    //   data.active,
    //   data.transaction,
    //   "total",
    //   parseInt(data.amount),
    //   parseInt(data.amount)
    // );

    await updateBankTransaction(
      data.branchId,
      data.transaction,
      "total",
      parseInt(data.amount),
      parseInt(data.amount)
    );
    await pushToFieldArray(data.source, data.branchId, "bank", data.bank);
    res.status(200).json({ message: `Branch ${data.name} successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const EditBank = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("the id is ", id);
    console.log(req.body);
    const data = req.body;
    console.log(data);

    // await updateBankTransaction(
    //   data.active,
    //   data.name,
    //   "total",
    //   parseInt(data.amount),
    //   parseInt(data.diff)
    // );
    await updateBankTransaction(
      data.branchId,
      data.name,
      "total",
      parseInt(data.amount),
      parseInt(data.diff)
    );
    delete data.diff;
    await admin.firestore().collection("Bank").doc(id).update(data);
    res
      .status(200)
      .json({ message: `Branch ${data.name} updated successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// const deleteBank = async (req, res) => {
//   try {
//     const { id, active } = req.params;
//     console.log(id);
//     // const totalBank = await getDocumentById("Bank", active);
//     const Bank = await getDocumentById("Bank", id);
//     // console.log(totalBank);
//     console.log(Bank);
//     await updateBank(
//       active,
//       Bank.name,
//       "total",
//       -parseInt(Bank.amount),
//       -parseInt(Bank.amount)
//     );
//     await admin.firestore().collection("Bank").doc(id).delete();
//     res.status(200).json({ message: `Branch deleted successfully.` });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };

module.exports = {
  CreateBank,
  EditBank,
  // deleteBank,
};
