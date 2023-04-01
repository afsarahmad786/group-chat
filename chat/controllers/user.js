const User = require("../models/user");
const bcrypt = require("bcrypt");

const path = require("path");

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
