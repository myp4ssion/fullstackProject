const Router = require("express");
const router = new Router();
const offerNewsController = require("../controllers/offerNewsController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", offerNewsController.create);
router.get("/", checkRole("ADMIN"), offerNewsController.getAll);
router.delete("/", checkRole("ADMIN"), offerNewsController.delete);

module.exports = router;
