const validateIdAndCnParams = (req, res, next) => {
  const { id, cn } = req.params;

  if (!id || !cn) {
    return res.status(400).json({
      message:
        "Request parameters are missing or empty. Please refresh your browser and try again.",
    });
  }

  // If both id and cn are present, continue to the next middleware or route handler
  next();
};

module.exports = validateIdAndCnParams;
