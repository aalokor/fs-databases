const router = require("express").Router();

const { Blog } = require("../models");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) {
    return res.status(404).end();
  }
  next();
};

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

router.post("/", async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body });
    console.log(blog.toJSON());
    return res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.delete("/:id", blogFinder, async (req, res) => {
  try {
    const deleted = await req.blog.destroy();
    if (deleted) {
      return res.status(200).json({ message: "Blog deleted" });
    } else {
      return res.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
