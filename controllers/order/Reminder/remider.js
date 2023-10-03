const updateOrAddReminder = require("../../../service/order/reminder/reminder");

/**
 * Set a reminder based on the request data.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
const setReminder = async (req, res) => {
  const reminder = req.body;
  console.log(reminder);

  try {
    await updateOrAddReminder(reminder);

    res.status(200).json({ message: "Reminder updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = setReminder;
