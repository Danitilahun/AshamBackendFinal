// const admin = require("../../config/firebase-admin");

// const updateCalculatorAmount = async (id, newIncome) => {
//   const db = admin.firestore();
//   try {
//     if (!id) {
//       throw new Error("Document ID cannot be empty.");
//     }
//     const docRef = db.collection("Calculator").doc(id);
//     const docSnapshot = await docRef.get();

//     if (!docSnapshot.exists) {
//       throw new Error("Document not found");
//     }
//     const data = docSnapshot.data();
//     console.log(data);
//     const incomeDifference = newIncome - data.income;
//     const newAmount = data.actual + incomeDifference;
//     const newBalance = data.sum - newAmount;

//     await docRef.update({
//       actual: newAmount,
//       income: newIncome,
//       balance: newBalance,
//     });

//     console.log("Calculator amount updated successfully");
//   } catch (error) {
//     console.log("Error updating Calculator amount:", error);
//   }
// };

// module.exports = updateCalculatorAmount;

const admin = require("../../config/firebase-admin");

/**
 * Update calculator amount within a batch.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} id - The document ID.
 * @param {number} newIncome - The new income value.
 * @returns {Promise<void>} A Promise that resolves when the batch operation is complete.
 */
const updateCalculatorAmount = async (db, batch, id, newIncome) => {
  try {
    if (!id) {
      throw new Error(
        "Unable to get calculator information to update.Please refresh your browser and try again."
      );
    }

    const docRef = db.collection("Calculator").doc(id);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      throw new Error("Document not found");
    }

    const data = docSnapshot.data();
    console.log(data);
    const incomeDifference = newIncome - data.income;
    const newAmount = data.actual + incomeDifference;
    const newBalance = data.sum - newAmount;

    console.log(newAmount, newIncome, newBalance);
    batch.update(docRef, {
      actual: newAmount,
      income: newIncome,
      balance: newBalance,
    });

    console.log("Calculator amount updated successfully");
  } catch (error) {
    console.log("Error updating Calculator amount:", error);
  }
};

module.exports = updateCalculatorAmount;
