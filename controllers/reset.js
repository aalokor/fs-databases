const router = require("express").Router();

const { Blog, User } = require("../models");

router.post("/", async (req, res, next) => {
  try {
    await Blog.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });

    res.status(200).json({ message: "Database reset" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
