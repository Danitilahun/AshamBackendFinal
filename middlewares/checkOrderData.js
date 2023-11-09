const checkOrderData = (req, res, next) => {
  const data = req.body;

  if (!data.active || !data.activeDailySummery || !data.activeTable) {
    return res.status(400).json({
      message:
        "You can't create an order since there is no daily table or sheet.",
    });
  }

  if (!data.branchId || !data.deliveryguyId || !data.deliveryguyName) {
    return res
      .status(400)
      .json({ message: "Branch ID and Delivery Guy ID or Name are required." });
  }

  console.log("checkOrderDataMiddleware");
  next();
};

module.exports = checkOrderData;
