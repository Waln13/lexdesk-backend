const express = require("express");
const router = express.Router();
const { verifyToken, soloRoles } = require("../middlewares/auth.middleware");
const { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } = require("../controllers/usuario.controller");

router.get("/", verifyToken, soloRoles("DUENO"), getUsuarios);
router.post("/", verifyToken, soloRoles("DUENO"), crearUsuario);
router.put("/:id", verifyToken, soloRoles("DUENO"), actualizarUsuario);
router.delete("/:id", verifyToken, soloRoles("DUENO"), eliminarUsuario);

module.exports = router;