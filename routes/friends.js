const express = require("express");
const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  delRequest,
  removeFriend,
} = require("../controllers/friends");
const { authenticate } = require("../middlewares/authenticate");
const router = express.Router();

router.post("/sendRequest", authenticate, sendRequest);
router.post("/acceptRequest", authenticate, acceptRequest);
router.post("/rejectRequest", authenticate, rejectRequest);
router.post("/delRequest", authenticate, delRequest);
router.post("/removeFriend", authenticate, removeFriend);

module.exports = router;
