const admin = require("../../config/firebase-admin");

const AdminMiddleware = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization.split(" ")[1];

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    console.log("from new admin");
    const userRecord = await admin.auth().getUser(uid);
    const customClaims = userRecord.customClaims;
    if (!customClaims || !customClaims.admin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this operation." });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
};

module.exports = AdminMiddleware;
