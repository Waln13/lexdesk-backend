const prisma = require("../utils/prisma");
const supabase = require("../utils/supabase");

const getDocumentos = async (req, res) => {
  const { casoId } = req.params;
  try {
    const documentos = await prisma.documento.findMany({
      where: { casoId: Number(casoId) },
      orderBy: { creadoEn: "desc" },
      include: {
        subidoPor: { select: { id: true, nombre: true } },
      },
    });
    res.json(documentos);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener documentos", error: err.message });
  }
};

const subirDocumento = async (req, res) => {
  const { casoId } = req.params;
  const { id: usuarioId } = req.usuario;

  try {
    if (!req.file) return res.status(400).json({ message: "No se envió ningún archivo" });

    const fileName = `caso-${casoId}/${Date.now()}-${req.file.originalname}`;

    const { error } = await supabase.storage
      .from("expedientes")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) return res.status(500).json({ message: "Error al subir archivo", error: error.message });

    const { data: urlData } = supabase.storage
      .from("expedientes")
      .getPublicUrl(fileName);

    const documento = await prisma.documento.create({
      data: {
        nombre: req.file.originalname,
        url: urlData.publicUrl,
        tipo: req.file.mimetype,
        casoId: Number(casoId),
        subidoPorId: usuarioId,
      },
    });

    res.status(201).json(documento);
  } catch (err) {
    res.status(500).json({ message: "Error al subir documento", error: err.message });
  }
};

const eliminarDocumento = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await prisma.documento.findUnique({ where: { id: Number(id) } });
    if (!doc) return res.status(404).json({ message: "Documento no encontrado" });

    const path = doc.url.split("/expedientes/")[1];
    await supabase.storage.from("expedientes").remove([path]);
    await prisma.documento.delete({ where: { id: Number(id) } });

    res.json({ message: "Documento eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar documento", error: err.message });
  }
};

module.exports = { getDocumentos, subirDocumento, eliminarDocumento };