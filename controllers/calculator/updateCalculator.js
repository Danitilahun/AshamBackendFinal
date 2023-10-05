const updateCalculatorValue = require("../../service/updateCalculator/updateCalculator");

const updateCalculator = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message:
          "Calculator information is missing.Please refresh your browser and try again.",
      });
    }
    const data = req.body;
    if (!data) {
      return res
        .status(400)
        .json({ message: "Request body is missing or empty." });
    }
    await updateCalculatorValue(data, id);
    res.status(200).json({ message: `Calculator updated successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = updateCalculator;
