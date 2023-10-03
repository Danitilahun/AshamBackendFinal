const generateSalaryFile = (data) => {
  const { type } = data;

  switch (type) {
    case "Bonus":
      return generateBonusSalaryFile(data);
    case "Penality":
      return generatePenaltySalaryFile(data);
    case "HolidayBonus":
      return generateHolidayBonusSalaryFile(data);
    case "StaffCredit":
      return generateDeliveryGuySalaryFile(data);
    default:
      throw new Error("Invalid data type");
  }
};

const generateBonusSalaryFile = (data) => {
  if (data.diff) {
    return {
      bonus: parseInt(data.diff),
      total: parseInt(data.diff),
    };
  } else {
    return {
      bonus: parseInt(data.amount),
      total: parseInt(data.amount),
    };
  }
};

const generatePenaltySalaryFile = (data) => {
  if (data.diff) {
    return {
      penality: parseInt(data.diff),
      total: -parseInt(data.diff),
    };
  } else {
    return {
      penality: parseInt(data.amount),
      total: -parseInt(data.amount),
    };
  }
};

const generateDeliveryGuySalaryFile = (data) => {
  if (data.diff) {
    return {
      totalCredit: parseInt(data.diff),
      total: -parseInt(data.diff),
    };
  } else {
    return {
      totalCredit: parseInt(data.amount),
      total: -parseInt(data.amount),
    };
  }
};
const generateHolidayBonusSalaryFile = (data) => {
  return {
    holidayBonus: parseInt(data.amount),
    total: parseInt(data.amount),
  };
};

module.exports = generateSalaryFile;
