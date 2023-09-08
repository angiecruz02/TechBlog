const router = require("express").Router();
const { user, blogPost, comment } = require("../models");
const withAuth = require("../utils/auth");

// GET route for the homepage
router.get("/", withAuth, async (req, res) => {
  try {
    // Get all blog posts and JOIN with user data
    const blogPostData = await blogPost.findAll({
      order: [["date_created", "DESC"]],
      include: [
        {
          model: user,
          attributes: ["username"],
        },
        {
          model: comment,
          include: {
            model: user,
            attributes: ["username"],
          },
        },
      ],
    });

    // Serialize data so the template can read it
    const blogs = blogPostData.map((blog) => blog.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render("homepage", {
      blogs,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET route for a single blog post
router.get("/blogpost/:id", withAuth, async (req, res) => {
  try {
    const blogPostData = await blogPost.findByPk(req.params.id, {
      include: [
        {
          model: comment,
        },
        {
          model: user,
          attributes: ["username"],
        },
      ],
    });
    if (!blogPostData) {
      res.status(404).json({ message: "No blogpost found with this id :(." });
      return;
    }

    const blog = blogPostData.get({ plain: true });

    res.render("blogpost", {
      blog,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get("/profile", withAuth, async (req, res) => {
  try {
    // Find the logged-in user based on the session ID
    const userData = await user.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: blogPost }],
    });

    const loggedInUser = userData.get({ plain: true });

    res.render("profile", {
      ...loggedInUser,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get('/dashboard', withAuth, (req, res) => {
    if(req.session.user) {
        return res.redirect('/login')
    }
    res.render('dashboard')
})
// GET route for the login page
router.get("/login", (req, res) => {
  // If the user is already logged in, redirect to another route (e.g., profile)
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

module.exports = router;
