const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/auth/signup");
const { signin } = require("../controllers/auth/signin");
const { userDetails } = require("../controllers/auth/userDetails");
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/userDetails", userDetails);
module.exports = router;
