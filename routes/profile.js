const express = require("express");
const { profileUpdate } = require("../controllers/profile/profileUpdate");
const { authenticate } = require("../middlewares/authenticate");
const router = express.Router();

router.post("/profileUpdate", authenticate, profileUpdate);

module.exports = router;
