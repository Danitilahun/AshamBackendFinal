const admin = require("../../config/firebase-admin");
const updateDocumentFields = require("../../utils/singleDocUpdate");

const CreatePrice = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const db = admin.firestore();
    const pricesCollection = db.collection("prices");
    await pricesCollection.add(data);
    res.status(200).json({ message: `Price created successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const CreateCompanyGainPrice = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const db = admin.firestore();
    const pricesCollection = db.collection("companyGain");
    await pricesCollection.add(data);
    res.status(200).json({ message: `Company gain created successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updatePrice = async (req, res) => {
  try {
    const data = req.body;
    await updateDocumentFields("prices", data);
    res.status(200).json({ message: `prices updated successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
const updateCompanyGainPrice = async (req, res) => {
  try {
    const data = req.body;
    await updateDocumentFields("companyGain", data);
    res.status(200).json({ message: `Company gain updated successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  CreatePrice,
  updatePrice,
  CreateCompanyGainPrice,
  updateCompanyGainPrice,
};
