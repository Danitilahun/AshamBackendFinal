const admin = require("../../config/firebase-admin");
const updateDashboardTotalCustomer = require("./updateDashboardTotalCustomer");

/**
 * Create or update a document in a Firestore collection using batch write operations.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch instance.
 * @param {string} collectionName - Name of the Firestore collection.
 * @param {string} documentId - ID of the document to create or update.
 * @param {Object} data - Data to be added or updated in the document.
 * @throws {Error} Throws an error if the operation fails.
 */
const createOrUpdateDocument = async (
  db,
  batch,
  collectionName,
  documentId,
  data
) => {
  const docRef = db.collection(collectionName).doc(documentId);

  // Check if the document exists
  const docSnapshot = await docRef.get();

  try {
    if (docSnapshot.exists) {
      data[data.type] = "Yes";
      batch.update(docRef, data);
      console.log(`Document with ID ${documentId} added to batch for update.`);
    } else {
      // Document does not exist, create it
      data.Asbeza = "No";
      data.Wifi = "No";
      data.Card = "No";
      data.Water = "No";
      data[data.type] = "Yes";
      batch.set(docRef, data);

      // You may want to add this to the batch as well
      await updateDashboardTotalCustomer(db, batch, 1);
      // const id2 = splitString(data.branchId);

      if (data.branchId) {
        const docRef1 = db.collection("branches").doc(data.branchId);

        // Use the batch to update the document
        batch.set(
          docRef1,
          { customerNumber: admin.firestore.FieldValue.increment(1) },
          { merge: true }
        );
      }
      console.log(`Document with ID ${documentId} added to batch for create.`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = createOrUpdateDocument;
