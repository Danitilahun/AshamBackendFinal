// const admin = require("../../../config/firebase-admin");

// const addStaffToTable = async (collectionName, documentId, newData, salary) => {
//   try {
//     // Get a reference to Firestore
//     const firestore = admin.firestore();
//     // Get the document reference
//     const documentRef = firestore.collection(collectionName).doc(documentId);
//     // Get the current data of the document
//     const documentSnapshot = await documentRef.get();
//     console.log(documentSnapshot.data());
//     if (!documentSnapshot.exists) {
//       console.log("Document not found");
//       return;
//     }

//     // Merge the new data with the existing document data
//     const old = documentSnapshot.data();
//     old.total.fixedSalary = salary + old.total.fixedSalary;
//     old.total.total = salary + old.total.total;

//     await documentRef.set({ ...old, ...newData }, { merge: true });

//     console.log("Staff added successfully.");
//     // Return the updated document data
//     const updatedDocumentSnapshot = await documentRef.get();
//     const updatedData = updatedDocumentSnapshot.data();

//     console.log("Staff added successfully.");

//     // Return the updated document data
//     return updatedData;
//   } catch (error) {
//     throw new Error(`Error getting/updating document: ${error.message}`);
//   }
// };

// module.exports = addStaffToTable;

// const admin = require("../../../config/firebase-admin");

const addStaffToTable = async (
  db,
  batch,
  collectionName,
  documentId,
  newData,
  salary
) => {
  try {
    if (!documentId) {
      throw new Error(
        "Unable to add staff to the table because branch information is missing.Please refresh your browser and try again."
      );
    }
    // Get the document reference
    const documentRef = db.collection(collectionName).doc(documentId);
    // Get the current data of the document
    const documentSnapshot = await documentRef.get();
    console.log(documentSnapshot.data());
    if (!documentSnapshot.exists) {
      console.log("Document not found");
      return;
    }

    // Merge the new data with the existing document data
    const old = documentSnapshot.data();
    old.total.fixedSalary = salary + old.total.fixedSalary;
    old.total.total = salary + old.total.total;

    // Update the document data in the batch
    batch.set(documentRef, { ...old, ...newData }, { merge: true });

    console.log("Staff added successfully.");

    // Return the updated data without fetching it
    return { ...old, ...newData };
  } catch (error) {
    throw error;
  }
};

module.exports = addStaffToTable;
