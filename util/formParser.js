const formidable = require("formidable");

const parseForm = (req) => {
  const form = new formidable.IncomingForm({ multiples: true });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

module.exports = parseForm;
