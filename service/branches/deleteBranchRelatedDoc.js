// const admin = require("../../config/firebase-admin");

// /**
//  * Delete specific collections and delivery guys related to a branch.
//  *
//  * @param {string} id - The ID of the branch for which collections and delivery guys will be deleted.
//  * @throws {Error} Throws an error if the operation fails.
//  */
// const deleteBranchRelatedDoc = async (id) => {
//   if (!id) {
//     return null;
//   }
//   try {
//     const db = admin.firestore();

//     // Step 1: Delete the "Bank" collection of the branch
//     await db.collection("Bank").doc(id).delete();

//     // Step 2: Delete the "Budget" collection of the branch
//     await db.collection("Budget").doc(id).delete();

//     // Step 3: Delete the "totalCredit" collection of the branch
//     await db.collection("totalCredit").doc(id).delete();

//     // Step 4: Delete delivery guys where branch field matches the provided id

//     // Log success message if collections and delivery guys are deleted
//     console.log(
//       `Collections (Bank, Budget, totalCredit) and delivery guys deleted for branch ID: ${id}`
//     );
//   } catch (error) {
//     // Log the error if any occurs
//     console.error("Error deleting collections and delivery guys:", error);
//     throw error;
//   }
// };

// module.exports = deleteBranchRelatedDoc;

const deleteBranchRelatedDoc = async (db, batch, id) => {
  try {
    if (!id) {
      throw new Error(
        "Unable to delete branch related documents because branch information is missing.Please refresh your browser and try again."
      );
    }
    // Step 1: Delete the "Bank" collection of the branch
    batch.delete(db.collection("Bank").doc(id));

    // Step 2: Delete the "Budget" collection of the branch
    batch.delete(db.collection("Budget").doc(id));

    // Step 3: Delete the "totalCredit" collection of the branch
    batch.delete(db.collection("totalCredit").doc(id));

    // Step 4: Delete delivery guys where branch field matches the provided id

    // Log success message if collections and delivery guys are deleted
    console.log(
      `Collections (Bank, Budget, totalCredit) and delivery guys deleted for branch ID: ${id}`
    );
  } catch (error) {
    // Log the error if any occurs
    console.error("Error deleting collections and delivery guys:", error);
    throw error;
  }
};

module.exports = deleteBranchRelatedDoc;
