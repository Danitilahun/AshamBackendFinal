const validateIdParam = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message:
        "Some essential information is missing. Please refresh your browser and try again.",
    });
  }

  // If the 'id' is present, continue to the next middleware or route handler
  next();
};

module.exports = validateIdParam;
