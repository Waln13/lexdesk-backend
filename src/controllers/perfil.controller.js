const prisma = require("../utils/prisma");
const bcrypt = require("bcryptjs");

const getPerfil = async (req, res) => {
  const { id } = req.usuario;
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: { id: true, nombre: true, email: true, rol: true, creadoEn: true },
    });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener perfil", error: err.message });
  }
};

const actualizarPerfil = async (req, res) => {
  const { id } = req.usuario;
  const { nombre, passwordActual, passwordNuevo } = req.body;
  try {
    const usuario = await prisma.usuario.findUnique({ where: { id } });

    if (passwordActual && passwordNuevo) {
      const valido = await bcrypt.compare(passwordActual, usuario.password);
      if (!valido) return res.status(401).json({ message: "Contraseña actual incorrecta" });
      const hash = await bcrypt.hash(passwordNuevo, 10);
      await prisma.usuario.update({
        where: { id },
        data: { nombre, password: hash },
      });
    } else {
      await prisma.usuario.update({
        where: { id },
        data: { nombre },
      });
    }

    res.json({ message: "Perfil actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar perfil", error: err.message });
  }
};

module.exports = { getPerfil, actualizarPerfil };