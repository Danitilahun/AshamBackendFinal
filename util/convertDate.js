const convertDate = (inputDate) => {
  // Create a Date object from the input string
  const date = new Date(inputDate);

  // Options for formatting the date
  const options = { year: "numeric", month: "long", day: "numeric" };

  // Format the date using the options
  const formattedDate = date.toLocaleDateString("en-US", options);

  return formattedDate;
};

module.exports = convertDate;
