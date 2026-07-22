const express = require("express");
const router = express.Router();
const multer = require("multer");
const { verifyToken } = require("../middlewares/auth.middleware");
const { getDocumentos, subirDocumento, eliminarDocumento } = require("../controllers/documento.controller");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/:casoId", verifyToken, getDocumentos);
router.post("/:casoId", verifyToken, upload.single("archivo"), subirDocumento);
router.delete("/:id", verifyToken, eliminarDocumento);

module.exports = router;
