const Router = require("express");
const router = new Router();
const newsRouter = require("./newsRouter");
const userRouter = require("./userRouter");
const offerNewsRouter = require("./offerNewsRouter");

router.use("/user", userRouter);
router.use("/news", newsRouter);
router.use("/offernews", offerNewsRouter);

module.exports = router;
