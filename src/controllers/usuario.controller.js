const prisma = require("../utils/prisma");
const bcrypt = require("bcryptjs");

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { creadoEn: "desc" },
      select: {
        id: true, nombre: true, email: true,
        rol: true, activo: true, creadoEn: true,
        casos: { select: { id: true } },
      },
    });
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuarios", error: err.message });
  }
};

const crearUsuario = async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  try {
    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) return res.status(400).json({ message: "El email ya está registrado" });

    const hash = await bcrypt.hash(password, 10);
    const usuario = await prisma.usuario.create({
      data: { nombre, email, password: hash, rol },
      select: { id: true, nombre: true, email: true, rol: true, activo: true },
    });
    res.status(201).json(usuario);
  } catch (err) {
    res.status(500).json({ message: "Error al crear usuario", error: err.message });
  }
};

const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol, activo } = req.body;
  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { nombre, email, rol, activo },
      select: { id: true, nombre: true, email: true, rol: true, activo: true },
    });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar usuario", error: err.message });
  }
};

const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.usuario.delete({ where: { id: Number(id) } });
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar usuario", error: err.message });
  }
};

module.exports = { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario };