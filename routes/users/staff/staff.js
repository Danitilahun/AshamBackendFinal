// Import required modules
const express = require("express");
const router = express.Router();
const AdminMiddleware = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const UserMiddleware = require("../../../middlewares/JoinedAuth/UserAuth");
const authMiddleware = require("../../../middlewares/adminAuth");
const createStaff = require("../../../controllers/users/staff/create");
const editStaff = require("../../../controllers/users/staff/edit");
const deleteStaff = require("../../../controllers/users/staff/delete");
const HandleStaffSalaryPayment = require("../../../controllers/users/staff/handleSalaryPayment");

// Define the route for creating data for an admin
router.post("/", UserMiddleware, createStaff);
router.put("/pay/:id", AdminMiddleware, HandleStaffSalaryPayment);
router.put("/:id", UserMiddleware, editStaff);
router.delete("/:id", UserMiddleware, deleteStaff);

// Export the router
module.exports = router;
