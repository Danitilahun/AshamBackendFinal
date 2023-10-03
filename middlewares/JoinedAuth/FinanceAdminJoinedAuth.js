const admin = require("../../config/firebase-admin");

const FinanceAdminAuth = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization.replace("Bearer ", "");
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const isAdmin = decodedToken.admin === true;
    const isCallCenter = decodedToken.finance === true;

    if (!isAdmin && !isCallCenter) {
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

module.exports = FinanceAdminAuth;
