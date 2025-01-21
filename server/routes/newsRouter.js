const Router = require("express");
const router = new Router();
const newsController = require("../controllers/newsController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), newsController.create);
router.get("/", newsController.getByThemeAndLimit);
router.delete("/", checkRole("ADMIN"), newsController.delete);
router.put("/", checkRole("ADMIN"), newsController.update);

module.exports = router;
