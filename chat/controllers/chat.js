const Chat = require("../models/chat");
const jwt = require("jsonwebtoken");
const path = require("path");

exports.sendmessage = async (req, res, next) => {
  const { message, reciever_id } = req.body;
  Chat.create({
    message: message,
    is_read: 0,
    reciever_id: reciever_id,
    userId: req.user.id,
  })
    .then((result) => {
      res.json({
        message: "Message Send Successfully",
        success: true,
        data: result,
      });
    })
    .catch((err) => {
      res.json(err);
    });
};

exports.chatpage = async (req, res, next) => {
  res.sendFile("home.html", {
    root: path.join(__dirname, "../public/views"),
  });
};
