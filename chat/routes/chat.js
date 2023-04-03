const path = require("path");

const express = require("express");
const userAuthenticate = require("../middleware/auth");
const chatcontroller = require("../controllers/chat");

const router = express.Router();

// router.get("/register", usercontroller.registerpage);
router.post(
  "/chat/send",
  // userAuthenticate.authenticate,
  chatcontroller.sendmessage
);

router.get(
  "/chat/send",
  // userAuthenticate.authenticate,
  chatcontroller.chatpage
);

module.exports = router;
