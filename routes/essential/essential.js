// Import required modules
const express = require("express");
const router = express.Router();
const EssentialAuth = require("../../middlewares/JoinedAuth/EssentialAuth");
const createEssentials = require("../../controllers/essentials/create");
const editEssentials = require("../../controllers/essentials/edit");
const deleteEssentials = require("../../controllers/essentials/delete");
const validateIdParam = require("../../middlewares/validateIdParam");
const checkRequestBodyMiddleware = require("../../middlewares/checkRequestBodyMiddleware");

// Define the route for creating data for an admin
router.post("/", EssentialAuth, checkRequestBodyMiddleware, createEssentials);
router.put("/:id", EssentialAuth, validateIdParam, editEssentials);
router.delete("/:id", EssentialAuth, validateIdParam, deleteEssentials);

module.exports = router;
