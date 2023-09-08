const router = require("express").Router();
const { user, blogPost, comment } = require("../models");
const withAuth = require("../utils/auth");

// get for blogPost
router.get("/", withAuth, async (req, res) => {
  try {
    const blogPost = await blogPost.findAll({
      include: [
        {
          model: user,
          attributes: ["username"],
        },
      ],
    });
    const blogs = blogPost.map((blog) => blog.get({ plain: true }));
    res.render("homepage", {
      blogs,
      logged_in: req.sessions.logged_in,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
