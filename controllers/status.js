const admin = require("../config/firebase-admin");
const getDocumentById = require("../utils/getDocumentById");
const updateStatus = require("../utils/updateStatusDoc");

const CreateStatus = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const newData = {
      expense: data.name,
      amount: parseInt(data.amount),
      branchId: data.branchId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      date: data.date,
    };
    const db = admin.firestore();
    const branchesCollection = db.collection("Expense");
    await branchesCollection.add(newData);

    const docRef = db.collection("finance").doc(data.branchId);

    // Get the document data
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      console.log("Document does not exist.");
      return;
    }

    const currentExpense = docSnapshot.data().totalExpense || 0; // Default to 0 if the field doesn't exist

    // Calculate the new totalExpense by adding the newExpense
    const updatedExpense = currentExpense + parseInt(data.amount);

    // Update the document with the new totalExpense
    await docRef.update({ totalExpense: updatedExpense });

    res.status(200).json({ message: `Branch ${data.name} successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const EditStatus = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("the id is ", id);
    console.log(req.body);
    const data = req.body;
    console.log(data);
    // delete data.diff;
    // await admin.firestore().collection("Status").doc(id).update(data);
    res
      .status(200)
      .json({ message: `Branch ${data.name} updated successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteStatus = async (req, res) => {
  try {
    const { id, active } = req.params;
    console.log(id);
    // const totalStatus = await getDocumentById("Status", active);
    const status = await getDocumentById("Status", id);
    // console.log(totalStatus);
    console.log(status);
    if (status.name === "Tax" || status.name === "tax") {
      await updateStatus(
        active,
        status.name,
        "totalExpense",
        0,
        parseInt(status.amount),
        "table"
      );
    } else {
      await updateStatus(
        active,
        status.name,
        "totalExpense",
        0,
        -parseInt(status.amount)
      );
    }
    await admin.firestore().collection("Status").doc(id).delete();
    res.status(200).json({ message: `Branch deleted successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  CreateStatus,
  EditStatus,
  deleteStatus,
};
