const router = require("express").Router();
const { tokenExtractor } = require("../util/middleware");

const { Blog, User } = require("../models");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) {
    return res.status(404).end();
  }
  next();
};

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
  });
  res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({ ...req.body, userId: user.id });
    console.log(blog.toJSON());
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", tokenExtractor, blogFinder, async (req, res, next) => {
  try {
    if (req.blog.userId !== req.decodedToken.id) {
      return res.status(403).json({
        error: "Error: Only the user who created the blog can delete it",
      });
    }
    await req.blog.destroy();
    res.status(200).json({ message: "Blog deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes;
    const modified = await req.blog.save();
    res.json(modified);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
