const express = require("express");
const router = express.Router();
const { verifyToken, soloRoles } = require("../middlewares/auth.middleware");
const {
  getClientes,
  getCliente,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} = require("../controllers/cliente.controller");

router.get("/", verifyToken, getClientes);
router.get("/:id", verifyToken, getCliente);
router.post("/", verifyToken, soloRoles("DUENO", "SECRETARIA"), crearCliente);
router.put("/:id", verifyToken, soloRoles("DUENO", "SECRETARIA"), actualizarCliente);
router.delete("/:id", verifyToken, soloRoles("DUENO"), eliminarCliente);

module.exports = router;