const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();
const sequelize = new Sequelize("groupchat", "root", "root", {
  dialect: "mysql",
  host: process.env.DB_HOST,
});

module.exports = sequelize;
