const router = require("express").Router();

const { User } = require("../models");

const userFinder = async (req, res, next) => {
  req.user = await User.findByPk(req.params.id);
  if (!req.user) {
    return res.status(404).end();
  }
  next();
};

const userFinderByName = async (req, res, next) => {
  req.user = await User.findOne({
    where: { username: req.params.username },
  });
  if (!req.user) {
    return res.status(404).end();
  }
  next();
};

router.get("/", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

router.post("/", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put("/:username", userFinderByName, async (req, res, next) => {
  try {
    req.user.username = req.body.username;
    const modified = await req.user.save();
    res.json(modified);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
