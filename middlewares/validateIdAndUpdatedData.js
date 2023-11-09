const validateIdAndUpdatedData = (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body;
  console.log(updatedData);
  if (!id || !updatedData) {
    return res.status(400).json({
      message:
        "Request parameters or body are missing or empty. Please refresh your browser and try again.",
    });
  }

  // If both id and updatedData are present, continue to the next middleware or route handler
  next();
};

module.exports = validateIdAndUpdatedData;
