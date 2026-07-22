const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const { getStats } = require("../controllers/stats.controller");

router.get("/", verifyToken, getStats);

module.exports = router;