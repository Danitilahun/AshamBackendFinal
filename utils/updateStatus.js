const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

const updateBalance = async (id, valueToAdd) => {
  try {
    const docRef = db.collection("Status").doc(id);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      throw new Error("Document not found");
    }

    const data = docSnapshot.data();
    const currentActual = data.totalStaffSalary || 0;
    const currentSum = data.sum || 0;
    const currentBalance = data.balance || 0;

    const newActual = currentActual + valueToAdd;
    const newSum = currentSum + newActual;
    const newBalance = newSum - newActual;

    await docRef.update({
      totalStaffSalary: valueToAdd,
      sum: newSum,
      balance: newBalance,
    });

    console.log("Document updated successfully");
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

module.exports = updateBalance;
