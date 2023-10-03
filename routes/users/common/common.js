// Import required modules
const express = require("express");
const router = express.Router();
const SuperAdminMiddleware = require("../../../middlewares/IndivitualAuth/SuperAdminMiddleware");
const UserMiddleware = require("../../../middlewares/JoinedAuth/UserAuth");
const disableUser = require("../../../controllers/users/common/disableUser");
const updateProfilePicture = require("../../../controllers/users/common/updateProfilePicture");

router.put("/disable/:id", SuperAdminMiddleware, disableUser);
router.put("/profileImageChange/:id", UserMiddleware, updateProfilePicture);

// Export the router
module.exports = router;
