const router = require("express").Router();
const userRoutes = require("./userRoutes");
const blogRoutes = require("./blogPostRoutes");
const commentRoutes = require("./commentRoutes");

router.use("/user", userRoutes);
router.use("/blog", blogRoutes);
router.use("/comment", commentRoutes);

module.exports = router;