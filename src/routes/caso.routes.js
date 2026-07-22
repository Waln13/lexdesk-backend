const express = require("express");
const router = express.Router();
const { verifyToken, soloRoles } = require("../middlewares/auth.middleware");
const { getCasos, getCaso, crearCaso, actualizarCaso, eliminarCaso } = require("../controllers/caso.controller");

router.get("/", verifyToken, getCasos);
router.get("/:id", verifyToken, getCaso);
router.post("/", verifyToken, soloRoles("DUENO", "SECRETARIA"), crearCaso);
router.put("/:id", verifyToken, soloRoles("DUENO", "SECRETARIA"), actualizarCaso);
router.delete("/:id", verifyToken, soloRoles("DUENO"), eliminarCaso);

module.exports = router;