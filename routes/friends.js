const express = require("express");
const { sendRequest } = require("../controllers/friends/sendRequest");
const { acceptRequest } = require("../controllers/friends/acceptRequest");
const { rejectRequest } = require("../controllers/friends/rejectRequest");
const { delRequest } = require("../controllers/friends/delRequest");
const { removeFriend } = require("../controllers/friends/removeFriend");

const { authenticate } = require("../middlewares/authenticate");
const router = express.Router();

router.post("/sendRequest", authenticate, sendRequest);
router.post("/acceptRequest", authenticate, acceptRequest);
router.post("/rejectRequest", authenticate, rejectRequest);
router.post("/delRequest", authenticate, delRequest);
router.post("/removeFriend", authenticate, removeFriend);

module.exports = router;
