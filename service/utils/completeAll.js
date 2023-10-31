const updateStatusToCompleted = require("./updateStatusToCompleted");

const completeAll = async (
  db,
  batch,
  branchId,
  deliveryguyId,
  date,
  status
) => {
  const changeStatusToCompleted = async (serviceType) => {
    try {
      // Assuming you have an 'updateStatusToCompleted' function
      await updateStatusToCompleted(
        serviceType,
        branchId,
        deliveryguyId,
        date,
        status,
        db,
        batch
      );

      await updateStatusToCompleted(
        serviceType,
        branchId + " normal",
        deliveryguyId,
        date,
        status,
        db,
        batch
      );
    } catch (error) {
      console.error("Error updating status:", error);
      throw error;
    }
  };

  const services = ["Asbeza", "Card", "Water", "Wifi"];

  for (const service of services) {
    await changeStatusToCompleted(service);
  }
};

module.exports = completeAll;
