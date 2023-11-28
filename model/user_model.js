const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

const UserModel = sequelize.define("User", {
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  isAdmin: DataTypes.BOOLEAN,
});

module.exports = UserModel;
