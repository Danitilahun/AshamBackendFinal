// Import required modules
const express = require("express");
const router = express.Router();
const EssentialAuth = require("../../middlewares/JoinedAuth/EssentialAuth");
const createEssentials = require("../../controllers/essentials/create");
const editEssentials = require("../../controllers/essentials/edit");
const deleteEssentials = require("../../controllers/essentials/delete");

// Define the route for creating data for an admin
router.post("/", EssentialAuth, createEssentials);
router.put("/:id", EssentialAuth, editEssentials);
router.delete("/:id", EssentialAuth, deleteEssentials);

module.exports = router;
