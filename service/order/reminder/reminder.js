const admin = require("../../../config/firebase-admin");
/**
 * Update or add a reminder in the database.
 * @param {Object} reminder - The reminder data to be updated or added.
 * @param {string} reminder.type - The type of reminder.
 * @param {string} reminder.callcenterId - The callcenter ID associated with the reminder.
 * @param {string} reminder.reminderDate - The new date for the reminder.
 * @param {import('firebase-admin').firestore.Firestore} db - The Firestore database instance.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */

const updateOrAddReminder = async (reminder) => {
  try {
    const db = admin.firestore();
    const remindersCollection = db.collection("reminders");

    // Check if a document with the specified type and callcenterId exists
    const querySnapshot = await remindersCollection
      .where("type", "==", reminder.type)
      .where("callcenterId", "==", reminder.callcenterId)
      .get();

    if (!querySnapshot.empty) {
      // If document exists, update only the date part of the existing document
      const docId = querySnapshot.docs[0].id;
      await remindersCollection.doc(docId).update({
        date: reminder.date,
      });
    } else {
      // If the document doesn't exist, add a new document
      await remindersCollection.add(reminder);
    }
  } catch (error) {
    throw error;
  }
};

module.exports = updateOrAddReminder;
