const express = require("express");
const router = express.Router();
const { verifyToken, soloRoles } = require("../middlewares/auth.middleware");
const { getCitas, crearCita, actualizarCita, eliminarCita } = require("../controllers/cita.controller");

router.get("/", verifyToken, getCitas);
router.post("/", verifyToken, soloRoles("DUENO", "SECRETARIA"), crearCita);
router.put("/:id", verifyToken, soloRoles("DUENO", "SECRETARIA"), actualizarCita);
router.delete("/:id", verifyToken, soloRoles("DUENO", "SECRETARIA"), eliminarCita);

module.exports = router;