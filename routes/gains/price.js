// Import required modules
const express = require("express");
const SuperAdminMiddleware = require("../../middlewares/IndivitualAuth/SuperAdminMiddleware");
const priceController = require("../../controllers/gainPrice/price");
const checkRequestBodyMiddleware = require("../../middlewares/checkRequestBodyMiddleware");

// Create a new router for sheets
const router = express.Router();

// Create a route for creating a new sheet
router.post(
  "/",
  SuperAdminMiddleware,
  checkRequestBodyMiddleware,
  priceController.CreatePrice
);
router.post(
  "/gain",
  SuperAdminMiddleware,
  checkRequestBodyMiddleware,
  priceController.CreateCompanyGainPrice
);
router.put("/update", SuperAdminMiddleware, priceController.updatePrice);
router.put(
  "/gainUpdate",
  SuperAdminMiddleware,
  priceController.updateCompanyGainPrice
);
// // Create a route for deleting an existing sheet
// router.delete("/:id", priceAuth , sheetController.deletesheet);

// Export the router
module.exports = router;
