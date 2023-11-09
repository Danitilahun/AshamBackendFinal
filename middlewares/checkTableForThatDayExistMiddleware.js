const admin = require("../config/firebase-admin");
const db = admin.firestore();

const checkTableForThatDayExistMiddleware = async (req, res, next) => {
  const { activeDailySummery, date } = req.body;

  if (!activeDailySummery || !date) {
    return res.status(400).json({
      message:
        "Request body is missing or empty.Please refresh your browser and try again.",
    });
  }

  const collectionPath = "tables";
  const documentId = activeDailySummery;
  const fieldName = date;

  try {
    const docRef = db.collection(collectionPath).doc(documentId);
    const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      const data = docSnapshot.data();
      if (data && data.hasOwnProperty(fieldName)) {
        next();
      } else {
        res.status(404).json({
          message: `You cannot create an order because there is no daily table available for the date ${data.date}. Please create a daily table for this date. If you believe you have already created a table for this day, this error may be due to an issue with your internet connection. Please check your internet connection and try again.`,
        });
      }
    } else {
      res.status(404).json({
        message:
          "Document not found. It may have been deleted or could not be retrieved due to a network issue.",
      });
    }
  } catch (error) {
    console.error("Error checking document:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    console.log("checkTableForThatDayExistMiddleware");
  }
};

module.exports = checkTableForThatDayExistMiddleware;
