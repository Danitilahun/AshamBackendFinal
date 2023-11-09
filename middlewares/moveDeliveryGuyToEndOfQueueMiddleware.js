const admin = require("../config/firebase-admin");
const moveDeliveryGuyToEndOfQueue = require("../service/users/deliveryGuyActiveness/moveDeliveryGuyToEndOfQueue");

const db = admin.firestore();
const batch = db.batch();

const moveDeliveryGuyToEndOfQueueMiddleware = async (req, res, next) => {
  const { branchKey, deliveryguyId, deliveryguyName } = req.body;

  try {
    await moveDeliveryGuyToEndOfQueue(
      db,
      batch,
      branchKey,
      deliveryguyId,
      deliveryguyName
    );
    await batch.commit();
    next();
  } catch (error) {
    console.error("Error moving delivery guy to the end of the queue:", error);
    return res.status(500).json({
      message:
        "Unable to move delivery guy to the end of the queue.This may be due to internet connection issues.Please check your internet connection and try again.",
    });
  }
};

module.exports = moveDeliveryGuyToEndOfQueueMiddleware;
