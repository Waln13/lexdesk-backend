const express = require("express");
const cors = require("cors");
require("dotenv/config");

const authRoutes = require("./src/routes/auth.routes");
const clienteRoutes = require("./src/routes/cliente.routes");
const casoRoutes = require("./src/routes/caso.routes");
const citaRoutes = require("./src/routes/cita.routes");
const usuarioRoutes = require("./src/routes/usuario.routes");
const documentoRoutes = require("./src/routes/documento.routes");
const statsRoutes = require("./src/routes/stats.routes");
const perfilRoutes = require("./src/routes/perfil.routes");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://lexdesk-frontend.vercel.app",
    /\.vercel\.app$/
  ],
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/casos", casoRoutes);
app.use("/api/citas", citaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/documentos", documentoRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/perfil", perfilRoutes);

app.get("/", (req, res) => {
  res.json({ message: "LexDesk API funcionando ✅" });
});

app.get("/fix-db", async (req, res) => {
  const prisma = require("./src/utils/prisma");
  try {
    await prisma.$queryRaw`ALTER TABLE "Caso" ADD COLUMN IF NOT EXISTS "numeroExpediente" TEXT UNIQUE`;
    await prisma.$queryRaw`ALTER TABLE "Cliente" ADD COLUMN IF NOT EXISTS "cedula" TEXT UNIQUE`;
    res.json({ message: "BD actualizada ✅" });
  } catch (err) {
    res.json({ message: "Error", error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});