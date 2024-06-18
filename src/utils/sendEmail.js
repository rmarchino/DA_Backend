const path = require("path");
const ejs = require("ejs");
const transporter = require("./mailer");

const sendWelcomeEmail = async (email, data) => {
  
    //Renderizar ejs (rutas)
  const filePath = path.join(__dirname, "../views/welcome/welcome.ejs");
  const doc = await ejs.renderFile(filePath, data);

  //Contenedor de archivos
  const attachments = [
    {
      filename: "illo_welcome_1.png",
      path: path.join(__dirname, "../views/welcome/images/illo_welcome_1.png"),
      cid: "welcome_image",
    },
    {
      filename: "Logo.png",
      path: path.join(__dirname, "../views/welcome/images/Logo.png"),
      cid: "logo_image",
    },
    {
      filename: "facebook2x.png",
      path: path.join(__dirname, "../views/welcome/images/facebook2x.png"),
      cid: "facebook",
    },
    {
      filename: "instagram2x.png",
      path: path.join(__dirname, "../views/welcome/images/instagram2x.png"),
      cid: "instagram",
    },
    {
      filename: "linkedin2x.png",
      path: path.join(__dirname, "../views/welcome/images/linkedin2x.png"),
      cid: "linkedin",
    },
  ];
  sendMail(email, doc, attachments);

};

const sendMail = (email, doc, attachments) => {
  //Enviar correo
  transporter
    .sendMail({
      from: "allpash123@gmail.com",
      to: email,
      subject: "DATANALYTICS",
      text: "Gracias por unirte a nuestro equipo",
      html: doc,
      attachments,
    })
    .then(() => console.log("Mensaje enviado"))
    .catch((error) => console.log(error));
};

module.exports = {
  sendWelcomeEmail,
};
