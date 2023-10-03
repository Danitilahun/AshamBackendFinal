const admin = require("../../../config/firebase-admin");

// const createBankCollection = async (id) => {
//   if (!id) return null;
//   console.log("id", id);
//   try {
//     const deliveryTurnCollectionRef = admin
//       .firestore()
//       .collection("Bank")
//       .doc(id);

//     const deliveryTurnDocumentSnapshot = await deliveryTurnCollectionRef.get();

//     if (!deliveryTurnDocumentSnapshot.exists) {
//       await deliveryTurnCollectionRef.set({
//         Withdraw: 0,
//         Deposit: 0,
//         total: 0,
//       });
//       console.log("Bank collection created successfully.");
//     } else {
//       console.log("Bank collection already exists.");
//     }

//     // Handle other logic here if needed...
//   } catch (error) {
//     // Handle errors here, you can log or throw the error as needed
//     console.error("Error in createBankCollection:", error);
//     throw error; // You can rethrow the error to propagate it up the call stack
//   }
// };

// module.exports = createBankCollection;

const createBankCollection = async (db, batch, branchId) => {
  if (!branchId) {
    return;
  }
  try {
    const bankCollectionRef = db.collection("Bank").doc(branchId);
    const bankDocumentSnapshot = await bankCollectionRef.get();

    if (!bankDocumentSnapshot.exists) {
      // Create initial data for the bank collection
      const bankData = {
        Withdraw: 0,
        Deposit: 0,
        total: 0,
      };

      // Add the operation to the batch
      batch.set(bankCollectionRef, bankData);
      console.log("Bank collection created successfully.");
    } else {
      console.log("Bank collection already exists.");
    }

    // Handle other logic here if needed...
  } catch (error) {
    // Handle errors here, you can log or throw the error as needed
    console.error("Error in createBankCollection:", error);
    throw error; // You can rethrow the error to propagate it up the call stack
  }
};

module.exports = createBankCollection;
