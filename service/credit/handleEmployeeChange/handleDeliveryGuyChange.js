const getDocumentDataById = require("../../utils/getDocumentDataById");
const updateDeliveryGuy = require("../updateDeliveryGuy/updateDeliveryGuy");

const handleDeliverGuyChange = async (db, batch, updatedData, creditId) => {
  try {
    const oldData = await getDocumentDataById("DailyCredit", creditId);

    if (
      oldData &&
      updatedData &&
      updatedData.deliveryguyId !== oldData.deliveryguyId
    ) {
      await updateDeliveryGuy(
        db,
        batch,
        oldData.deliveryguyId,
        "dailyCredit",
        -parseInt(oldData.amount)
      );
      await updateDeliveryGuy(
        db,
        batch,
        updatedData.deliveryguyId,
        "dailyCredit",
        parseInt(oldData.amount)
      );
    }
  } catch (error) {
    console.error("Error in handleDeliverGuyChange:", error);
    throw error; // Re-throw the error to be handled at the caller's level
  }
};

module.exports = handleDeliverGuyChange;
