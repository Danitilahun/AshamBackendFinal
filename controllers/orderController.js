const admin = require("firebase-admin");

const createOrder = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const db = admin.firestore();
    const branchesCollection = db.collection("orders");
    await branchesCollection.add(data);
    res.status(200).json({ message: `Order created successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, customerAddress, items } = req.body;
    const data = { customerName, customerAddress, items };
    await admin.firestore().collection("orders").doc(id).update(data);
    res.status(200).json({ message: "Order updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await admin.firestore().collection("orders").doc(id).delete();
    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Export the controller functions
module.exports = {
  createOrder,
  updateOrder,
  deleteOrder,
};
