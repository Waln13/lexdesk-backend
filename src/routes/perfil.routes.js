const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const { getPerfil, actualizarPerfil } = require("../controllers/perfil.controller");

router.get("/", verifyToken, getPerfil);
router.put("/", verifyToken, actualizarPerfil);

module.exports = router;