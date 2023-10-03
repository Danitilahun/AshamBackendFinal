const admin = require("../config/firebase-admin");

const updateStatus = async (
  customId,
  fieldToSet,
  fieldToIncrement,
  valueToSet,
  valueToIncrement,
  from = "other"
) => {
  const db = admin.firestore();

  const creditRef = db.collection("Status").doc(customId);

  // Check if the document exists
  const creditDoc = await creditRef.get();
  console.log("from", from);
  if (creditDoc.exists) {
    const updateData = {};
    updateData[fieldToSet] = valueToSet;
    // Set the field to the specified value
    if (from === "salary") {
      const currentValue = creditDoc.get(fieldToSet) || 0;
      const newsalary = valueToSet - currentValue;
      console.log(newsalary);
      const currentValueT = creditDoc.get(fieldToIncrement) || 0;
      updateData[fieldToIncrement] = currentValueT + newsalary;
    } else if (from === "other") {
      console.log(from);
      // Increment the specified field by the provided value
      const currentValue = creditDoc.get(fieldToIncrement) || 0;
      updateData[fieldToIncrement] = currentValue + valueToIncrement;
    } else {
      let currentValueTax = 0;
      if (fieldToSet === "tax") {
        currentValueTax = valueToSet;
      } else {
        currentValueTax = creditDoc.get("tax") || 0;
      }
      let income = 0;
      if (fieldToSet === "totalIncome") {
        income = valueToSet;
      } else {
        income = creditDoc.get("totalIncome") || 0;
      }
      console.log(currentValueTax);
      if (currentValueTax !== 0) {
        console.log(income);
        console.log(currentValueTax);
        let newtax = parseInt(income) * parseInt(currentValueTax);
        const newTax = newtax / 100;
        const totaltax = (income = creditDoc.get("totaltax") || 0);
        const currentValueT = creditDoc.get(fieldToIncrement) || 0;
        updateData[fieldToIncrement] = currentValueT + (newTax - totaltax);
        updateData["totaltax"] = newTax;
      } else {
        updateData["totaltax"] = 0;
      }
    }
    await creditRef.update(updateData);
    return updateData;
  }
  return null;
};

module.exports = updateStatus;
