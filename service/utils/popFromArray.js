const admin = require("../../config/firebase-admin");

const popArrayElement = async (
  fieldName,
  elementToRemove,
  id,
  collectionName
) => {
  const db = admin.firestore();
  const docRef = db.collection(collectionName).doc(id);

  try {
    const snapshot = await docRef.get();
    if (snapshot.exists) {
      const data = snapshot.data();

      if (data[fieldName] && Array.isArray(data[fieldName])) {
        const newArray = data[fieldName].filter(
          (item) => item !== elementToRemove
        );

        await docRef.update({ [fieldName]: newArray });
        console.log(`Element "${elementToRemove}" removed from array.`);
      } else {
        console.log(`Field "${fieldName}" is not an array.`);
      }
    } else {
      console.log("Document does not exist.");
    }
  } catch (error) {
    console.error("Error removing element:", error);
  }
};

module.exports = popArrayElement;
