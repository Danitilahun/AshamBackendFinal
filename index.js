const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

app.use(express.json({ limit: "60mb", extended: true }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const apiRoutes = require("./routes/api");
const priceRoute = require("./routes/gains/price");

app.use("/price", priceRoute);
app.use(
  "/api",
  (req, res, next) => {
    console.log(req.body);
    next();
  },
  apiRoutes
);

app.get("/", (req, res) => {
  res.send("GET request received!");
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
