const { sequelize } = require("../util/db");
const Blog = require("./blog");
const User = require("./user");

User.hasMany(Blog);
Blog.belongsTo(User);

const syncAll = async () => {
  await sequelize.sync({ alter: true });
};

syncAll();

module.exports = {
  Blog,
  User,
};
