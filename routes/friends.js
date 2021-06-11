const express = require("express");
const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  delRequest,
  removeFriend,
  getPendingRequests,
} = require("../controllers/friends");
const router = express.Router();

router.post("/sendRequest", sendRequest);
router.post("/acceptRequest", acceptRequest);
router.post("/rejectRequest", rejectRequest);
router.post("/delRequest", delRequest);
router.post("/removeFriend", removeFriend);
router.get("/requests", getPendingRequests);

module.exports = router;
