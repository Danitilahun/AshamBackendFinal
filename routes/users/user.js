const express = require("express");
const router = express.Router();
const adminRoute = require("./admin/admin");
const staffRoute = require("./staff/staff");
const deliveryRoute = require("./deliveryGuy/deliveryGuy");
const callCenterRoute = require("./callCenter/callCenter");
const commonRoute = require("./common/common");
const financeRoute = require("./finance/finance");
// Use sub-routes under "/api/user"

router.use("/admin", adminRoute);
router.use("/finance", financeRoute);
router.use("/common", commonRoute);
router.use("/callCenter", callCenterRoute);
router.use("/deliveryGuy", deliveryRoute);
router.use("/staff", staffRoute);

module.exports = router;
