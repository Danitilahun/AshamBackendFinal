const admin = require("../../config/firebase-admin");

const CreateNotificationToken = async (req, res) => {
  try {
    const data = req.body;
    const db = admin.firestore();
    const collectionRef = db.collection("notificationTokens");
    const documentRef = collectionRef.doc();

    await documentRef.set(data);

    res.status(200).json({ message: `Branch ${data.name} successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = CreateNotificationToken;
