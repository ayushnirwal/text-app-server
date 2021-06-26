const express = require("express");
const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  delRequest,
  removeFriend,
  getPendingRequests,
} = require("../controllers/friends");
const { authenticate } = require("../middlewares/authenticate");
const router = express.Router();

router.post("/sendRequest", authenticate, sendRequest);
router.post("/acceptRequest", authenticate, acceptRequest);
router.post("/rejectRequest", authenticate, rejectRequest);
router.post("/delRequest", authenticate, delRequest);
router.post("/removeFriend", authenticate, removeFriend);
router.get("/requests", getPendingRequests);

module.exports = router;
