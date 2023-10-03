const RemoveSalaryFile = (data) => {
  const { type } = data;

  switch (type) {
    case "Bonus":
      return generateBonusSalaryFile(data);
    case "Penality":
      return generatePenaltySalaryFile(data);
    case "StaffCredit":
      return generateDeliveryGuySalaryFile(data);
    default:
      throw new Error("Invalid data type");
  }
};

const generateBonusSalaryFile = (data) => {
  return {
    bonus: -parseInt(data.amount),
    total: -parseInt(data.amount),
  };
};

const generatePenaltySalaryFile = (data) => {
  return {
    penality: -parseInt(data.amount),
    total: parseInt(data.amount),
  };
};

const generateDeliveryGuySalaryFile = (data) => {
  return {
    totalCredit: -parseInt(data.amount),
    total: parseInt(data.amount),
  };
};

module.exports = RemoveSalaryFile;
