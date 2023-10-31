const admin = require("../../config/firebase-admin");
const updateCalculatorAmount = require("./updateCalculatorAmount");

// const updateFieldInCollection = async (
//   collectionName,
//   fieldToUpdate,
//   incrementBy
// ) => {
//   try {
//     const db = admin.firestore();
//     const collectionRef = db.collection(collectionName);

//     // Retrieve all documents in the collection
//     const snapshot = await collectionRef.get();

//     // Update the specified field in each document
//     snapshot.forEach(async (doc) => {
//       const docRef = collectionRef.doc(doc.id);
//       await docRef.update({
//         [fieldToUpdate]: admin.firestore.FieldValue.increment(incrementBy),
//       });
//       await updateCalculatorAmount(doc.id, parseFloat(incrementBy));
//       console.log(`Updated ${fieldToUpdate} in ${collectionName}/${doc.id}`);
//     });

//     console.log(
//       `Successfully updated ${fieldToUpdate} in all documents in ${collectionName}`
//     );
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

// module.exports = updateFieldInCollection;

// const admin = require("../../config/firebase-admin");

//

// const admin = require("../../config/firebase-admin");
// const updateCalculatorAmount = require("./updateCalculatorAmount");

/**
 * Update a field in a collection within a batch.

 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch object.
 * @param {string} collectionName - Name of the Firestore collection.
 * @param {string} fieldToUpdate - Name of the field to update.
 * @param {number} incrementBy - Value to increment by.
 * @returns {Promise<void>} A Promise that resolves when the batch operation is complete.
 */
const updateFieldInCollection = async (
  db,
  batch,
  collectionName,
  fieldToUpdate,
  incrementBy
) => {
  try {
    const collectionRef = db.collection(collectionName);
    const snapshot = await collectionRef.get();

    // Declare an array to collect doc.id values
    const docIds = [];

    // Update the specified field in each document within the batch
    snapshot.forEach((doc) => {
      const docRef = collectionRef.doc(doc.id);
      const previousValue = doc.data()[fieldToUpdate]; // Get the previous value
      const updatedValue = previousValue + incrementBy; // Calculate the updated value
      // Perform the update within the batch

      batch.update(docRef, {
        [fieldToUpdate]: admin.firestore.FieldValue.increment(incrementBy),
      });

      // Push the doc.id into the array
      docIds.push([doc.id, updatedValue]);

      console.log(`Updated ${fieldToUpdate} in ${collectionName}/${doc.id}`);
    });

    // Now you have the doc.id values collected in the `docIds` array
    console.log(
      `Updated ${fieldToUpdate} in these documents: ${docIds.join(", ")}`
    );

    console.log("Updating Calculator amount...", docIds);

    for (const [docId, updatedValue] of docIds) {
      await updateCalculatorAmount(db, batch, docId, parseFloat(updatedValue));
    }

    console.log(
      `Successfully updated ${fieldToUpdate} in all documents in ${collectionName}`
    );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

module.exports = updateFieldInCollection;
