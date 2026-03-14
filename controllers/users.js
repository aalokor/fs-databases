const router = require("express").Router();
const bcrypt = require("bcrypt");

const { User, Blog } = require("../models");

const userFinder = async (req, res, next) => {
  req.user = await User.findByPk(req.params.id);
  if (!req.user) {
    return res.status(404).end();
  }
  next();
};

const userFinderByUsername = async (req, res, next) => {
  req.user = await User.findOne({
    where: { username: req.params.username },
  });
  if (!req.user) {
    return res.status(404).end();
  }
  next();
};

router.get("/", async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["passwordHash"] },
    include: {
      model: Blog,
      attributes: {
        exclude: ["userId"],
      },
    },
  });
  res.json(users);
});

router.get("/:id", userFinder, async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: ["name", "username"],
    include: [
      {
        model: Blog,
        as: "readings",
        attributes: { exclude: ["userId", "createdAt", "updatedAt"] },
        through: {
          attributes: ["id", "read"],
        },
      },
    ],
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { username, name, password } = req.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      username,
      name,
      passwordHash,
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put("/:username", userFinderByUsername, async (req, res, next) => {
  try {
    req.user.username = req.body.username;
    const modified = await req.user.save();
    res.json(modified);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
