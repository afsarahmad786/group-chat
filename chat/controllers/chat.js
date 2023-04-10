const Chat = require("../models/chat");
const User = require("../models/user");
const Group = require("../models/group");
const Participent = require("../models/participants");
const jwt = require("jsonwebtoken");
const path = require("path");
const { Op } = require("sequelize");

exports.sendmessage = async (req, res, next) => {
  const { message, groupid } = req.body;
  Chat.create({
    message: message,
    is_read: 0,
    userId: req.user.id,
    groupId: groupid,
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
      userId: req.user.id,
      // [Op.or]: [{ reciever_id: 2 }, { reciever_id: req.user.id }],
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

exports.creategroup = async (req, res, next) => {
  const { name, ids } = req.body;
  const group = await Group.create({
    name: name,
    userId: req.user.id,
  })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      res.json(err);
    });

  for (const id of ids) {
    Participent.create({
      groupId: group["id"],
      userId: id,
    })
      .then((result) => {
        //  return result;
      })
      .catch((err) => {
        res.json(err);
      });
  }
  Participent.create({
    groupId: group["id"],
    userId: req.user.id,
  })
    .then((result) => {
      //  return result;
    })
    .catch((err) => {
      res.json(err);
    });
  res.json({
    message: "Group Created Successfully",
    success: true,
    data: group,
  });
};

exports.getgroup = async (req, res, next) => {
  const participent = await Participent.findAll({
    where: {
      userId: req.user.id,
    },
    attributes: ["id", "groupId"],
    include: [
      {
        model: Group,
      },
    ],
  })
    .then((result) => {
      console.log("testtttttttttttttttttttttt", result);

      // return result
      res.json({
        message: "Group Fetched Successfully",
        success: true,
        data: result,
      });
    })
    .catch((err) => console.log(err));

  // Group.findAll({
  //   where: {
  //     userId: req.user.id,
  //   },
  //   attributes: ["id", "name"],
  // })
  //   .then((result) => {
  //     console.log('testttttttttttttttttttt', req.user.id);
  //     res.json({
  //       message: "Group Fetched Successfully",
  //       success: true,
  //       data: result,
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

exports.grouppage = async (req, res, next) => {
  res.sendFile("group.html", {
    root: path.join(__dirname, "../public/views"),
  });
};

exports.getgroupchat = async (req, res, next) => {
  const id = req.query.id;
  const groupchate = await Group.findByPk(id)
    .then((result) => {
      return result;
    })
    .catch((err) => console.log(err));
  // const participants=await  Participent.findAll({
  //   where: {
  //     groupId:groupchate['id'],
  //   },
  // })
  // .then((result) => {
  //   return result
  // })
  // .catch((err) => console.log(err));
  Chat.findAll({
    where: {
      groupId: groupchate["id"],
    },
  })
    .then((result) => {
      res.json({
        message: "Group Fetched Successfully",
        success: true,
        data: result,
      });
    })
    .catch((err) => console.log(err));
};
