// const admin = require("../../config/firebase-admin");

// // Initialize Firebase Admin SDK here

// const deleteId1FieldAndReduceTotal = async (documentId, id1FieldToDelete) => {
//   try {
//     if (!documentId) {
//       return null;
//     }
//     const db = admin.firestore();
//     const docRef = db.collection("staffSalary").doc(documentId);
//     await db.runTransaction(async (transaction) => {
//       const docSnapshot = await transaction.get(docRef);

//       if (!docSnapshot.exists) {
//         console.log("Document does not exist");
//       }

//       const data = docSnapshot.data();

//       // Check if the id1FieldToDelete exists in the document
//       if (!data.hasOwnProperty(id1FieldToDelete)) {
//         console.log(`Field ${id1FieldToDelete} does not exist`);
//         return;
//       }

//       const id1Data = data[id1FieldToDelete];
//       const totalData = data["total"];

//       // Calculate the reduction values
//       const reduction = {
//         bonus: id1Data.bonus,
//         penality: id1Data.penality,
//         credit: id1Data.credit,
//         total: id1Data.total,
//       };

//       // Delete the id1FieldToDelete
//       delete data[id1FieldToDelete];

//       // Reduce the associated values from the total field
//       for (const key in reduction) {
//         if (reduction.hasOwnProperty(key)) {
//           totalData[key] -= reduction[key];
//         }
//       }

//       // Update the document with the modified data
//       transaction.update(docRef, data);
//     });

//     return "Field deleted and total reduced successfully.";
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

// module.exports = deleteId1FieldAndReduceTotal;
