const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

function generateAccessToken(id, name) {
  return jwt.sign(
    { userId: id, name: name },
    "abaabajdbjahdahdad55a35656@###@@@bnakl"
  );
}
exports.registerpage = async (req, res, next) => {
  res.sendFile("register.html", {
    root: path.join(__dirname, "../public/views"),
  });
};
exports.register = async (req, res, next) => {
  const { name, email, password, phone } = req.body;
  console.log(req.body);

  try {
    const hashedPwd = await bcrypt.hash(password, 10);
    const insertResult = await User.create({
      name: name,
      password: hashedPwd,
      email: email,
      phone: phone,
    });
    res.json({
      message: "User Registered Successfully",
      success: true,
      data: insertResult,
    });
    // res.send(insertResult);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error Occured");
  }
};

exports.login = async (req, res, next) => {
  const password = req.body.password;
  const email = req.body.email;
  const user = await User.findOne({ where: { email: email } })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      res.json({
        message: "User Not Found",
        status: 404,
        success: false,
      });
      res.end();
    });
  try {
    if (user) {
      const cmp = await bcrypt.compare(password, user.password);
      if (cmp) {
        res.json({
          message: "User Logged in Successfully",
          success: true,
          status: 200,
          data: user,
          token: generateAccessToken(user.id, user.name),
        });
      } else {
        res.json({
          message: "Password is incorrect",
          message: "User Not Authorized",
          status: 401,
          success: false,
          // data: [],
        });
      }
    } else {
      res.json({
        message: "User Not Found",
        status: 404,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error Occured in Login");
  }
};
