const admin = require("../config/firebase-admin");

const updateBalance = async (id, valueToAdd, from) => {
  const db = admin.firestore();
  try {
    const docRef = db.collection("Calculator").doc(id);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      throw new Error("Document not found");
    }
    console.log(valueToAdd);
    const data = docSnapshot.data();
    let newActual = 0;
    const currentActual = data.actual || 0;
    let currentcredit = data.totalCredit || 0;
    if (from === "credit") {
      // console.log("in credit");
      const newcredit = valueToAdd - currentcredit;
      currentcredit = newcredit;
      newActual = currentActual - newcredit;
    } else if (from === "fee") {
      console.log("in fee");
      newActual = currentActual + valueToAdd;
    } else {
      console.log("in order");
      newActual = currentActual + valueToAdd;
    }
    const currentSum = data.sum || 0;
    const newBalance = currentSum - newActual;

    await docRef.update({
      actual: newActual,
      balance: newBalance,
      totalCredit: from === "credit" ? valueToAdd : currentcredit,
    });

    console.log("Document updated successfully");
  } catch (error) {
    console.log("Error updating document:", error);
  }
};

module.exports = updateBalance;
