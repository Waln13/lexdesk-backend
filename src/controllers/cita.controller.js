const prisma = require("../utils/prisma");

const getCitas = async (req, res) => {
  try {
    const { rol, id } = req.usuario;

    const citas = await prisma.cita.findMany({
      where: rol === "ABOGADO" ? { abogadoId: id } : {},
      orderBy: { fecha: "asc" },
      include: {
        caso: { include: { cliente: true } },
        abogado: { select: { id: true, nombre: true } },
      },
    });
    res.json(citas);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener citas", error: err.message });
  }
};

const crearCita = async (req, res) => {
  const { fecha, motivo, casoId, abogadoId } = req.body;
  try {
    const cita = await prisma.cita.create({
      data: {
        fecha: new Date(fecha),
        motivo,
        casoId: Number(casoId),
        abogadoId: Number(abogadoId),
      },
      include: {
        caso: { include: { cliente: true } },
        abogado: { select: { id: true, nombre: true } },
      },
    });
    res.status(201).json(cita);
  } catch (err) {
    res.status(500).json({ message: "Error al crear cita", error: err.message });
  }
};

const actualizarCita = async (req, res) => {
  const { id } = req.params;
  const { fecha, motivo, completada } = req.body;
  try {
    const cita = await prisma.cita.update({
      where: { id: Number(id) },
      data: {
        fecha: fecha ? new Date(fecha) : undefined,
        motivo,
        completada,
      },
    });
    res.json(cita);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar cita", error: err.message });
  }
};

const eliminarCita = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.cita.delete({ where: { id: Number(id) } });
    res.json({ message: "Cita eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar cita", error: err.message });
  }
};

module.exports = { getCitas, crearCita, actualizarCita, eliminarCita };