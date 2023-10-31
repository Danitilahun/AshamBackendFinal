const admin = require("../../config/firebase-admin");

const BankAuth = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization.replace("Bearer ", "");
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const isAdmin = decodedToken.admin === true;
    const isCallCenter = decodedToken.finance === true;
    const isSuperAdmin = decodedToken.superAdmin === true;

    if (!isAdmin && !isCallCenter && !isSuperAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action." });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
};

module.exports = BankAuth;
