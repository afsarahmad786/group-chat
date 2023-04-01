const express = require("express");
const bodyParser = require("body-parser");
const User = require("./models/user");
const UserRoutes = require("./routes/user");
var cors = require("cors");
const app = express();
app.use(bodyParser.json());

const dotenv = require("dotenv");

dotenv.config();
const sequelize = require("./util/database");

app.use(UserRoutes);

const port = 3000;

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    console.log(result);

    app.listen(process.env.PORT || 3000);
  })

  // console.log(user);
  .catch((err) => {
    console.log(err);
  });
