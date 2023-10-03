// Generate Custom ID using crypto
const crypto = require("crypto");

const generateCustomID = (input) => {
  const hash = crypto.createHash("sha256");
  hash.update(input);
  return hash.digest("hex");
};

module.exports = generateCustomID;
