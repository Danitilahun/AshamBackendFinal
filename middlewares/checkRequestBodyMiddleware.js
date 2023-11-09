const checkRequestBodyMiddleware = (req, res, next) => {
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({
      message:
        "Request body is missing or empty. Please refresh your browser and try again.",
    });
  }
  console.log("checkRequestBodyMiddleware");
  // If the request body is not missing or empty, continue to the next middleware or route handler.
  next();
};

module.exports = checkRequestBodyMiddleware;
