// const admin = require("../../../config/firebase-admin");

const addHolidayForAllStaff = async (docId, holidayBonus, db, batch) => {
  if (!docId) {
    throw new Error(
      "Unable to add holiday bonus because table information is missing.Please refresh your browser and try again."
    );
  }
  const docRef = db.collection("staffSalary").doc(docId);

  try {
    const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      const docData = docSnapshot.data();
      const updatedData = {};
      let totalHoliday = 0;

      for (const key in docData) {
        if (
          key !== "total" &&
          docData.hasOwnProperty(key) &&
          typeof docData[key].holidayBonus === "number"
        ) {
          totalHoliday = totalHoliday + holidayBonus;
          updatedData[key] = {
            ...docData[key],
            holidayBonus:
              parseInt(docData[key].holidayBonus) + parseInt(holidayBonus),
            total: docData[key].total + parseInt(holidayBonus),
          };
        }
      }

      updatedData.total = docData.total;
      updatedData.branchId = docData.branchId;
      updatedData.sheetId = docData.sheetId;
      updatedData.total.total =
        parseInt(updatedData.total.total) + parseInt(totalHoliday);
      updatedData.total.holidayBonus =
        parseInt(updatedData.total.holidayBonus) + parseInt(totalHoliday);

      // Use the provided batch for the update operation
      batch.update(docRef, updatedData);

      return updatedData;
    } else {
      return null; // Document doesn't exist
    }
  } catch (error) {
    console.error("Error adding holiday bonuses:", error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
};

module.exports = addHolidayForAllStaff;
