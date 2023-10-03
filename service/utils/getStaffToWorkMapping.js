const getStaffSalaryData = require("../../util/getStaffSalaryData");

const getStaffToWorkMapping = async (staffWorkers) => {
  const deliveryToWorkMapping = {};
  let totalSalary = 0;
  for (const staffWorker of staffWorkers) {
    totalSalary = parseInt(totalSalary) + parseInt(staffWorker.salary);
    const work = getStaffSalaryData(staffWorker.salary);
    work.uniqueName = staffWorker.uniqueName;
    work.name = staffWorker.name;
    deliveryToWorkMapping[staffWorker.id] = work;
  }
  deliveryToWorkMapping.total.total = totalSalary;
  deliveryToWorkMapping.total.fixedSalary = totalSalary;
  delete deliveryToWorkMapping.total.addbonus;
  return deliveryToWorkMapping;
};

module.exports = getStaffToWorkMapping;
