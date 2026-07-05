const { Router } = require("express");
const c = require("./session.controller");

const router = Router();

router.get("/",             c.getSession);
router.post("/logout",      c.destroySession);
router.get("/:feature",     c.getFeature);
router.put("/:feature",     c.setFeature);
router.delete("/:feature",  c.clearFeature);

module.exports = router;
