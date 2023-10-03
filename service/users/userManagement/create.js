// // createUserDoc.js
const admin = require("../../../config/firebase-admin");

// /**
//  * Create a user document in Firestore.
//  * @param {string} uid - User ID.
//  * @param {Object} userData - User data including fullName, phone, bankAccount, etc.
//  * @param {string} imageUrl - URL of the user's profile image.
//  * @param {string} collection - Firestore collection name.
//  * @throws {Error} Throws an error if the operation fails.
//  */

// const createUserDocument = async (uid, userData, imageUrl, collection) => {
//   const db = admin.firestore();

//   try {
//     const userDocumentData = {
//       ...userData,
//       profileImage: imageUrl,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     };

//     await db.collection(collection).doc(uid).set(userDocumentData);
//     console.log("User document successfully created!");
//   } catch (error) {
//     console.error(error);
//     throw new Error("Failed to create user document.");
//   }
// };

// module.exports = createUserDocument;

/**
 * Create a user document in Firestore.
 * @param {string} uid - User ID.
 * @param {Object} userData - User data including fullName, phone, bankAccount, etc.
 * @param {string} imageUrl - URL of the user's profile image.
 * @param {string} collection - Firestore collection name.
 * @param {admin.firestore.WriteBatch} batch - Firestore batch to include the operation in.
 * @param {admin.firestore.Firestore} db - Firestore database instance.
 * @throws {Error} Throws an error if the operation fails.
 */

const createUserDocument = async (
  uid,
  userData,
  imageUrl,
  collection,
  db,
  batch
) => {
  try {
    const userDocumentData = {
      ...userData,
      profileImage: imageUrl,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const userDocumentRef = db.collection(collection).doc(uid);

    // Set the user document data in the batch
    batch.set(userDocumentRef, userDocumentData);

    console.log("User document successfully created!");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create user document.");
  }
};

module.exports = createUserDocument;
