import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jhonatan.baca.5@gmail.com",
    pass: "pxzz yksa affj qxyq",
  },
});

export const enviarCodigo = async (to: string, link: string): Promise<void> => {
  await transporter.sendMail({
    from: "jhonatan.baca.5@gmail.com",
    to,
    subject: "Tu código de restablecimiento de contraseña",
    html: `<p>Haz clic en el enlace para restablecer tu contraseña:</p>
           <a href="${link}">Restablecer contraseña</a><br>
           <p>Este enlace expirará en 15 minutos.</p>`,
  });
};
