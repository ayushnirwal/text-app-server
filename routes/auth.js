const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  userDetails,
} = require("../controllers/auth");
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/userDetails", userDetails)
module.exports = router;
