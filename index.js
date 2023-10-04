const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");

const admin = require("./config/firebase-admin");
require("dotenv").config();

// configration

const app = express();
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// routes

const adminRoute = require("./routes/admin");
const branchRoute = require("./routes/branch");
const callCenterRoute = require("./routes/callcenter");
const financeRoute = require("./routes/finance");
const deliveryguyRoute = require("./routes/deliveryguy");
const sheetRoute = require("./routes/sheet");
const tableRoute = require("./routes/table");
const priceRoute = require("./routes/gains/price");
const orderRoute = require("./routes/order");
const reportRoute = require("./routes/report");
const creditRoute = require("./routes/credit");
const statusRoute = require("./routes/status");
const bankRoute = require("./routes/bank");
// const dashboardRoute = require("./routes/dashboard");
const notificationRoute = require("./routes/notification");

app.use("/admin", adminRoute);
app.use("/branch", branchRoute);
app.use("/callcenter", callCenterRoute);
app.use("/finance", financeRoute);
app.use("/order", orderRoute);
app.use("/deliveryguy", deliveryguyRoute);
app.use("/sheet", sheetRoute);
app.use("/table", tableRoute);
app.use("/price", priceRoute);
app.use("/report", reportRoute);
app.use("/credit", creditRoute);
app.use("/status", statusRoute);
app.use("/bank", bankRoute);
// app.use("/dashboard", dashboardRoute);
app.use("/notification", notificationRoute);

const apiRoutes = require("./routes/api");

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("GET request received!");
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
