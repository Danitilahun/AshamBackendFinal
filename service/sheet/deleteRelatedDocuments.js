// // deleteRelatedDocuments.js
// const admin = require("../../config/firebase-admin");

// const deleteRelatedDocuments = async (sheetData) => {
//   try {
//     await Promise.all([
//       admin.firestore().collection("Status").doc(sheetData.active).delete(),
//       admin.firestore().collection("Calculator").doc(sheetData.active).delete(),
//     ]);

//     await Promise.all([
//       admin.firestore().collection("tables").doc(sheetData.active).delete(),
//       admin
//         .firestore()
//         .collection("tables")
//         .doc(sheetData.activeDailySummery)
//         .delete(),
//       admin
//         .firestore()
//         .collection("staffSalary")
//         .doc(sheetData.active)
//         .delete(),
//       admin.firestore().collection("Salary").doc(sheetData.active).delete(),
//     ]);

//     if (sheetData.Tables) {
//       await Promise.all(
//         sheetData.Tables.map((tableId) =>
//           admin.firestore().collection("tables").doc(tableId).delete()
//         )
//       );
//     }
//   } catch (error) {
//     console.error("Error deleting related documents:", error);
//     throw error;
//   }
// };

// module.exports = deleteRelatedDocuments;

const deleteRelatedDocuments = async (sheetData, db, batch) => {
  try {
    if (!sheetData.active || !sheetData.activeDailySummery) {
      return;
    }
    // Delete related documents using the provided batch
    batch.delete(db.collection("Status").doc(sheetData.active));
    batch.delete(db.collection("Calculator").doc(sheetData.active));
    batch.delete(db.collection("tables").doc(sheetData.active));
    batch.delete(db.collection("salary").doc(sheetData.active));
    batch.delete(db.collection("staffSalary").doc(sheetData.active));
    batch.delete(db.collection("tables").doc(sheetData.activeDailySummery));

    if (sheetData.Tables) {
      sheetData.Tables.forEach((tableId) => {
        batch.delete(db.collection("tables").doc(tableId));
      });
    }

    // Commit the batch to execute all delete operations
  } catch (error) {
    console.error("Error deleting related documents:", error);
    throw error;
  }
};

module.exports = deleteRelatedDocuments;
