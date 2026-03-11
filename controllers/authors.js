const router = require("express").Router();
const { Sequelize } = require("sequelize");

const { Blog } = require("../models");

router.get("/", async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      "author",
      [Sequelize.fn("COUNT", Sequelize.col("*")), "articles"],
      [Sequelize.fn("SUM", Sequelize.col("likes")), "likes"],
    ],
    group: ["author"],
  });
  res.json(authors);
});

module.exports = router;
