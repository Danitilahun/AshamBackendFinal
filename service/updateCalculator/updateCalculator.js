const admin = require("../../config/firebase-admin");

const updateCalculatorValue = async (formData, docId) => {
  try {
    if (!formData || !docId) {
      return;
    }
    // Get the existing calculator document
    const db = admin.firestore();
    const calculatorRef = db.collection("Calculator").doc(docId);
    const calculatorSnapshot = await calculatorRef.get();

    if (!calculatorSnapshot.exists) {
      throw new Error(`Calculator does not exist.`);
    }

    const existingData = calculatorSnapshot.data();

    // Merge the changes from the request body into the existing data
    const updatedData = { ...existingData, ...formData };
    console.log("updatedData", updatedData);
    // Calculate the sum based on the updated data
    const sum = Object.keys(updatedData)
      .filter((key) => !isNaN(parseInt(key)))
      .reduce(
        (acc, key) => acc + parseInt(key) * parseInt(updatedData[key]),
        0
      );
    console.log("sum", sum);
    // Calculate the balance
    const actual = parseInt(updatedData.actual || 0);
    const balance = sum - actual;

    // Update the sum and balance in the data
    updatedData.sum = sum;
    updatedData.balance = balance;
    console.log("updatedData", updatedData);
    // Update the Firestore document with the updated data
    await calculatorRef.update(updatedData);

    return { message: "Calculator updated successfully." };
  } catch (error) {
    console.error("Error updating calculator:", error);
    throw error;
  }
};

module.exports = updateCalculatorValue;
