const getStaffSalaryData = (salary) => ({
  addbonus: "addbonus",
  bonus: 0,
  penality: 0,
  fixedSalary: parseInt(salary),
  holidayBonus: 0,
  totalCredit: 0,
  total: parseInt(salary),
});

module.exports = getStaffSalaryData;
