const Chat = require("../models/chat");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const path = require("path");
const { Op } = require("sequelize");

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

exports.getchat = async (req, res, next) => {
  Chat.findAll({
    where: {
      [Op.or]: [{ userId: req.user.id }, { userId: 2 }],
      [Op.or]: [{ reciever_id: 2 }, { reciever_id: req.user.id }],
    },
    // where: {
    //   [Op.and]: [{ userId: 2 }, { reciever_id: req.user.id }],
    //   // [Op.and]: [{ userId: req.user.id }, { reciever_id: 2 }],
    // },
    include: [
      {
        attributes: ["id", "name", "email", "phone"],
        model: User,
      },
      {
        attributes: ["id", "name", "email", "phone"],
        model: User,
        as: "sender",
      },
    ],
  })
    .then((result) => {
      console.log(result);
      res.json({
        message: "Message Fetched Successfully",
        success: true,
        data: result,
      });
    })
    .catch((err) => console.log(err));
};

exports.getnewchat = async (req, res, next) => {
  const lastid = req.query.id;
  console.log("reqqqqqqqqqqqqqqqq", lastid);
  Chat.findAll({
    where: {
      [Op.and]: [
        { userId: req.user.id },
        { reciever_id: 2 },
        {
          id: {
            [Op.gt]: lastid,
          },
        },
      ],
    },

    include: [
      {
        attributes: ["id", "name", "email", "phone"],
        model: User,
      },
    ],
  })
    .then((result) => {
      console.log(result);
      res.json({
        message: "Message Fetched Successfully",
        success: true,
        data: result,
      });
    })
    .catch((err) => console.log(err));
};
