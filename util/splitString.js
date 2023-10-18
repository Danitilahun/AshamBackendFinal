const splitString = (str) => {
  const parts = str.split(" ");
  if (parts.length > 1) {
    return parts[0];
  } else {
    return str;
  }
};

module.exports = splitString;
