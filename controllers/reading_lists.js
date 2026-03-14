const router = require("express").Router();
const { tokenExtractor } = require("../util/middleware");

const { Blog, User, ReadingList } = require("../models");

router.post("/", async (req, res, next) => {
  try {
    const { userId, blogId } = req.body;

    if (!userId || !blogId) {
      return res.status(400).json({ error: "userId and blogId required" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Error: User does not exist" });
    }

    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Error: Blog does not exist" });
    }

    const existing = await ReadingList.findOne({
      where: { userId, blogId }, // use camelCase
    });

    if (existing) {
      return res
        .status(400)
        .json({ error: "Error: Blog is already in your reading list" });
    }

    const newEntry = await ReadingList.create({
      userId,
      blogId,
      read: false,
    });

    return res.status(201).json({
      id: newEntry.id,
      user_id: newEntry.userId,
      blog_id: newEntry.blogId,
      read: newEntry.read,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", tokenExtractor, async (req, res, next) => {
  try {
    const reading = await ReadingList.findByPk(req.params.id);

    if (!reading) {
      return res.status(404).end();
    }

    if (reading.userId !== req.decodedToken.id) {
      return res.status(401).json({
        error:
          "Error: User can only change the status of entries in their own reading list",
      });
    }

    reading.read = req.body.read;
    const modified = await reading.save();

    res.json(modified);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
