// Import required modules
const express = require("express");
const router = express.Router();
const SuperAdminMiddleware = require("../../../middlewares/IndivitualAuth/SuperAdminMiddleware");
const createAdmin = require("../../../controllers/users/admin/create");
const editAdmin = require("../../../controllers/users/admin/edit");
const deleteAdmin = require("../../../controllers/users/admin/delete");

// Define the route for creating data for an admin
router.post("/", SuperAdminMiddleware, createAdmin);

router.put("/:id", SuperAdminMiddleware, editAdmin);

router.delete("/:id", SuperAdminMiddleware, deleteAdmin);

// Export the router
module.exports = router;
