const prisma = require("../utils/prisma");

const getStats = async (req, res) => {
  const { rol, id } = req.usuario;

  try {
    const hoy = new Date();
    const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);

    const whereAbogado = rol === "ABOGADO" ? { abogadoId: id } : {};

    const [totalCasos, casosActivos, totalClientes, citasHoy, totalDocumentos, casosRecientes, citasProximas] = await Promise.all([
      prisma.caso.count({ where: whereAbogado }),
      prisma.caso.count({ where: { ...whereAbogado, estado: { in: ["NUEVO", "EN_PROCESO"] } } }),
      rol === "ABOGADO" ? Promise.resolve(0) : prisma.cliente.count(),
      prisma.cita.count({
        where: {
          ...whereAbogado.abogadoId ? { abogadoId: id } : {},
          fecha: { gte: inicioDia, lt: finDia },
          completada: false,
        },
      }),
      prisma.documento.count(),
      prisma.caso.findMany({
        where: whereAbogado,
        orderBy: { creadoEn: "desc" },
        take: 5,
        include: { cliente: true },
      }),
      prisma.cita.findMany({
        where: {
          ...rol === "ABOGADO" ? { abogadoId: id } : {},
          fecha: { gte: new Date() },
          completada: false,
        },
        orderBy: { fecha: "asc" },
        take: 5,
        include: {
          caso: { include: { cliente: true } },
          abogado: { select: { nombre: true } },
        },
      }),
    ]);

    res.json({
      totalCasos,
      casosActivos,
      totalClientes,
      citasHoy,
      totalDocumentos,
      casosRecientes,
      citasProximas,
    });
  } catch (err) {
    res.status(500).json({ message: "Error al obtener stats", error: err.message });
  }
};

module.exports = { getStats };