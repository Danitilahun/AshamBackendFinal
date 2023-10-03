const admin = require("../config/firebase-admin");
const getCountOfDocuments = require("../utils/getCountOfDocuments");
const updateDocumentFields = require("../utils/singleDocUpdate");

const createDocumentWithRandomId = async (collectionName) => {
  try {
    const db = admin.firestore();
    const docRef = db.collection(collectionName).doc(); // Automatically generates a random ID
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      // Create the document with empty fields
      await docRef.set({});
      console.log(
        `Document created in '${collectionName}' with ID: ${docRef.id}`
      );
    } else {
      console.log(
        `Document already exists in '${collectionName}' with ID: ${docRef.id}`
      );
    }
  } catch (error) {
    console.error("Error creating document:", error);
  }
};

const CreateNotificationToken = async (req, res) => {
  try {
    const data = req.body;
    // await createDocumentWithRandomId("notificationTokens");
    await updateDocumentFields("notificationTokens", data);
    res.status(200).json({ message: `Branch ${data.name} successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { CreateNotificationToken };
