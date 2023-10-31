const admin = require("../../config/firebase-admin");

const getDocuments = async (
  collectionName,
  branchId,
  deliveryguyId,
  date,
  status
) => {
  try {
    const db = admin.firestore();
    const collectionRef = db.collection(collectionName);

    let query = collectionRef;

    // Apply filters based on provided parameters
    if (branchId) {
      query = query.where("branchId", "==", branchId);
    }
    if (deliveryguyId) {
      query = query.where("deliveryguyId", "==", deliveryguyId);
    }
    if (date) {
      query = query.where("date", "==", date);
    }
    if (status) {
      query = query.where("status", "==", status);
    }
    const querySnapshot = await query.get();
    const documents = [];

    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    // console.log(documents);
    return documents;
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
};

module.exports = getDocuments;
