const prisma = require("../utils/prisma");

const getCasos = async (req, res) => {
  try {
    const { rol, id } = req.usuario;

    const casos = await prisma.caso.findMany({
      where: rol === "ABOGADO" ? { abogadoId: id } : {},
      orderBy: { creadoEn: "desc" },
      include: {
        cliente: true,
        abogado: { select: { id: true, nombre: true, rol: true } },
      },
    });
    res.json(casos);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener casos", error: err.message });
  }
};

const getCaso = async (req, res) => {
  const { id } = req.params;
  try {
    const caso = await prisma.caso.findUnique({
      where: { id: Number(id) },
      include: {
        cliente: true,
        abogado: { select: { id: true, nombre: true } },
        citas: true,
        documentos: true,
      },
    });
    if (!caso) return res.status(404).json({ message: "Caso no encontrado" });
    res.json(caso);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener caso", error: err.message });
  }
};

const crearCaso = async (req, res) => {
  const { titulo, descripcion, tipo, area, clienteId, abogadoId, numeroExpediente } = req.body;
  console.log("body recibido:", req.body);
  try {
    const caso = await prisma.caso.create({
      data: {
        titulo,
        descripcion,
        tipo,
        area,
        numeroExpediente: numeroExpediente || null,
        clienteId: Number(clienteId),
        abogadoId: abogadoId ? Number(abogadoId) : null,
      },
      include: { cliente: true },
    });
    res.status(201).json(caso);
  } catch (err) {
    console.log("error:", err.message);
    res.status(500).json({ message: "Error al crear caso", error: err.message });
  }
};

const actualizarCaso = async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, tipo, area, estado, abogadoId, numeroExpediente } = req.body;
  try {
    const caso = await prisma.caso.update({
      where: { id: Number(id) },
      data: {
        titulo,
        descripcion,
        tipo,
        area,
        estado,
        numeroExpediente: numeroExpediente || null,
        abogadoId: abogadoId ? Number(abogadoId) : null,
      },
    });
    res.json(caso);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar caso", error: err.message });
  }
};

const eliminarCaso = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.caso.delete({ where: { id: Number(id) } });
    res.json({ message: "Caso eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar caso", error: err.message });
  }
};

module.exports = { getCasos, getCaso, crearCaso, actualizarCaso, eliminarCaso };