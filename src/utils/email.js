const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const enviarNotificacionCaso = async ({ abogadoEmail, abogadoNombre, casoTitulo, clienteNombre }) => {
  try {
    await resend.emails.send({
      from: "LexDesk <onboarding@resend.dev>",
      to: abogadoEmail,
      subject: `Nuevo caso asignado: ${casoTitulo}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #fff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #f59e0b; font-size: 24px; margin-bottom: 8px;">Grupo Legal F. Contreras</h1>
          <p style="color: #94a3b8; font-size: 14px; margin-bottom: 32px;">Sistema de Gestión Legal</p>
          
          <h2 style="color: #fff; font-size: 18px;">Hola, ${abogadoNombre}</h2>
          <p style="color: #cbd5e1;">Se te ha asignado un nuevo caso:</p>
          
          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p style="color: #94a3b8; font-size: 12px; text-transform: uppercase; margin: 0 0 4px;">Caso</p>
            <p style="color: #fff; font-size: 16px; font-weight: bold; margin: 0 0 16px;">${casoTitulo}</p>
            <p style="color: #94a3b8; font-size: 12px; text-transform: uppercase; margin: 0 0 4px;">Cliente</p>
            <p style="color: #fff; font-size: 14px; margin: 0;">${clienteNombre}</p>
          </div>
          
          <p style="color: #cbd5e1;">Ingresa al sistema para ver los detalles del caso.</p>
          
          <p style="color: #475569; font-size: 12px; margin-top: 32px;">Grupo Legal F. Contreras — Sistema LexDesk</p>
        </div>
      `,
    });
    console.log("Email enviado a:", abogadoEmail);
  } catch (err) {
    console.log("Error enviando email:", err.message);
  }
};

module.exports = { enviarNotificacionCaso };