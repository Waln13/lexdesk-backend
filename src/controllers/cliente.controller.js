const prisma = require("../utils/prisma");

const getClientes = async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { creadoEn: "desc" },
      include: { casos: true },
    });
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener clientes", error: err.message });
  }
};

const getCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: Number(id) },
      include: { casos: true },
    });
    if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener cliente", error: err.message });
  }
};

const crearCliente = async (req, res) => {
  const { nombre, telefono, email, direccion } = req.body;
  try {
    const cliente = await prisma.cliente.create({
      data: { nombre, telefono, email, direccion },
    });
    res.status(201).json(cliente);
  } catch (err) {
    res.status(500).json({ message: "Error al crear cliente", error: err.message });
  }
};

const actualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, email, direccion } = req.body;
  try {
    const cliente = await prisma.cliente.update({
      where: { id: Number(id) },
      data: { nombre, telefono, email, direccion },
    });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar cliente", error: err.message });
  }
};

const eliminarCliente = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.cliente.delete({ where: { id: Number(id) } });
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar cliente", error: err.message });
  }
};

module.exports = { getClientes, getCliente, crearCliente, actualizarCliente, eliminarCliente };