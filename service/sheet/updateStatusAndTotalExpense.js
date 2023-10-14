// /**
//  * Updates the status data and recalculates the total expense based on the provided update data.
//  * @param {Object} statusData - The original status data.
//  * @param {Object} updateData - The update data.
//  * @returns {Object} The updated status data.
//  */
// const updateStatusAndTotalExpense = (statusData, updateData) => {
//   if (!statusData || !updateData) {
//     return null;
//   }
//   const updatedStatusData = { ...statusData };

//   // Update the fields in statusData based on updateData
//   updatedStatusData.ethioTelBill = parseInt(updateData.ethioTelBill) || 0;
//   updatedStatusData.houseRent = parseInt(updateData.houseRent) || 0;
//   updatedStatusData.wifi = parseInt(updateData.wifi) || 0;
//   updatedStatusData.taxPersentage = parseInt(updateData.taxPersentage) || 0;
//   updatedStatusData.totalIncome = parseInt(statusData.totalIncome) || 0;

//   // Calculate totalTax based on totalIncome and taxPersentage
//   updatedStatusData.totaltax =
//     (updatedStatusData.totalIncome * updatedStatusData.taxPersentage) / 100;
//   // Check if ExpenseOneName exists and is not empty in updateData
//   // Update ExpenseOne

//   const updateExpense = (expenseName, expenseAmountKey) => {
//     if (updateData[expenseName] && updateData[expenseName].trim() !== "") {
//       if (
//         updateData[expenseAmountKey] !== "" &&
//         updateData[expenseAmountKey] !== 0
//       ) {
//         updatedStatusData[updateData[expenseName]] = parseInt(
//           updateData[expenseAmountKey]
//         );
//       } else {
//         console.log(updatedStatusData[updateData[expenseName]]);

//         delete updatedStatusData[updateData[expenseName]];
//       }
//     }
//   };

//   updateExpense("ExpenseOneName", "ExpenseOneAmount");

//   // Update ExpenseTwo
//   updateExpense("ExpenseTwoName", "ExpenseTwoAmount");

//   // Update ExpenseThree
//   updateExpense("ExpenseThreeName", "ExpenseThreeAmount");

//   console.log(updatedStatusData);
//   // Calculate the total expense by summing all numeric fields in updatedStatusData
//   updatedStatusData.totalExpense = Object.entries(updatedStatusData)
//     .filter(
//       ([key, value]) =>
//         key !== "taxPersentage" &&
//         key !== "totalExpense" &&
//         key !== "totalIncome"
//     )
//     .reduce((sum, [key, value]) => {
//       if (typeof value === "number" && !isNaN(value)) {
//         return sum + value;
//       }
//       return sum;
//     }, 0);

//   return updatedStatusData;
// };

// module.exports = updateStatusAndTotalExpense;

/**
 * Updates the status data and recalculates the total expense based on the provided update data.
 * @param {Object} statusData - The original status data.
 * @param {Object} updateData - The update data.
 * @returns {Object} The updated status data.
 */
const updateStatusAndTotalExpense = (statusData, updateData) => {
  try {
    if (!statusData || !updateData) {
      return null;
    }
    const updatedStatusData = { ...statusData };

    // Update the fields in statusData based on updateData
    updatedStatusData.ethioTelBill = parseInt(updateData.ethioTelBill) || 0;
    updatedStatusData.houseRent = parseInt(updateData.houseRent) || 0;
    updatedStatusData.wifi = parseInt(updateData.wifi) || 0;
    updatedStatusData.taxPersentage = parseInt(updateData.taxPersentage) || 0;
    updatedStatusData.totalIncome = parseInt(statusData.totalIncome) || 0;

    // Calculate totalTax based on totalIncome and taxPersentage
    updatedStatusData.totaltax =
      (updatedStatusData.totalIncome * updatedStatusData.taxPersentage) / 100;

    // Check if ExpenseOneName exists and is not empty in updateData
    // Update ExpenseOne
    const updateExpense = (expenseName, expenseAmountKey) => {
      if (updateData[expenseName] && updateData[expenseName].trim() !== "") {
        if (
          updateData[expenseAmountKey] !== "" &&
          updateData[expenseAmountKey] !== 0
        ) {
          updatedStatusData[updateData[expenseName]] = parseInt(
            updateData[expenseAmountKey]
          );
        } else {
          console.log(updatedStatusData[updateData[expenseName]]);
          delete updatedStatusData[updateData[expenseName]];
        }
      }
    };

    updateExpense("ExpenseOneName", "ExpenseOneAmount");
    // Update ExpenseTwo
    updateExpense("ExpenseTwoName", "ExpenseTwoAmount");
    // Update ExpenseThree
    updateExpense("ExpenseThreeName", "ExpenseThreeAmount");

    console.log(updatedStatusData);
    // Calculate the total expense by summing all numeric fields in updatedStatusData
    updatedStatusData.totalExpense = Object.entries(updatedStatusData)
      .filter(
        ([key, value]) =>
          key !== "taxPersentage" &&
          key !== "totalExpense" &&
          key !== "totalIncome"
      )
      .reduce((sum, [key, value]) => {
        if (typeof value === "number" && !isNaN(value)) {
          return sum + value;
        }
        return sum;
      }, 0);

    return updatedStatusData;
  } catch (error) {
    console.error("Error in updateStatusAndTotalExpense:", error);
    throw error; // Re-throw the error to be handled at the caller's level
  }
};

module.exports = updateStatusAndTotalExpense;
