const router = require("express").Router();
const { tokenExtractor } = require("../util/middleware");

const { Blog, User, ReadingList } = require("../models");

router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    const { userId, blogId } = req.body;
    const user = await User.findByPk(req.decodedToken.id);

    if (userId !== user.id) {
      return res.status(403).json({
        error: "Error: User can only add blogs to their own list",
      });
    }

    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({
        error: "Error: Blog does not exist",
      });
    }

    const existing = await ReadingList.findOne({
      where: { user_id: userId, blog_id: blogId },
    });

    if (existing) {
      return res.status(400).json({
        error: "Error: Blog is already in your reading list",
      });
    }

    const newEntry = await ReadingList.create({
      userId: userId,
      blogId: blogId,
      read: false,
    });

    return res.json(newEntry);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
