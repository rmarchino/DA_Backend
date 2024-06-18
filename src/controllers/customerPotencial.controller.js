const { ClientesPotenciales, Servicios } = require("../models");
const transporter = require("../utils/mailer");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

require("dotenv").config();

const nuevoClientePotencial = async (req, res, next) => {
  try {
    const { nombre, email, mensaje, telefono, servicioId } = req.body;

    //verificar si el servicio existe
    const servicio = await Servicios.findByPk(servicioId);
    if (!servicio) {
      return res.status(400).json({
        error: "Servicio no encontrado",
      });
    }

    //crear el nuevo cliente potencial
    const clientePotencial = await ClientesPotenciales.create({
      nombre,
      email,
      mensaje,
      telefono,
      servicioId,
    });

    //Detalles del cotrreo electrónido
    const mailOptions = {
      from: process.env.G_USER,
      to: "comprangelo@gmail.com",
      replyTo: email,
      subject: "Nuevo cliente potencial",
      text: `El cliente ${nombre} se ha puesto en contacto solicitando información sobre el servicio "${servicio.nombre}".\n\nDetalles del mensaje:\nNombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\nMensaje: ${mensaje}`,
    };

    //Enviar el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error al enviar el correo: ", error);
      } else {
        console.log("Correo enviado: " + info.response);
      }
    });
    res.status(201).json({
      message: "Cliente potencial se ha registrado con éxito",
      clientePotencial,
    });
  } catch (error) {
    next(error);
  }
};

const mostrarClientesPotenciales = async (req, res, next) => {
  try {
    const clientes = await ClientesPotenciales.findAll({
      include: {
        model: Servicios,
        attributes: ["nombre"],
      },
    });
    res.json(clientes);
  } catch (error) {
    next(error);
  }
};

const mostrarClientePotencial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const clientePotencial = await ClientesPotenciales.findByPk(id, {
      include: {
        model: Servicios,
        attributes: ["nombre"],
      },
    });

    if (!clientePotencial) {
      res.json({
        status: 404,
        name: "Cliente potencial incorrecto",
        message: "El cliente potencial no existe",
      });
    }
    res.json(clientePotencial);
  } catch (error) {
    next(error);
  }
};

const eliminarClientePotencial = async (req, res, next) => {
  try {
    const clientePotencialId = req.params.id;

    //Buscar el servicio por su id
    const clientePotencial = await ClientesPotenciales.findOne({
      where: { id: clientePotencialId },
    });

    if (!clientePotencial) {
      return next({
        status: 404,
        name: "Cliente potencial incorrecto",
        message: "El cliente potencial no existe",
      });
    }

    //eliminar el servicio
    await clientePotencial.destroy({ where: { id: clientePotencialId } });

    return res.json({
      message: "Cliente ptencial eliminado con éxito",
    });
  } catch (error) {
    next(error);
  }
};

const buscarClientePotencial = async (req, res, next) => {
  try {
    const { query } = req.params;
    const clientePotencial = await ClientesPotenciales.findAll({
      where: {
        nombre: {
          [Op.iLike]: `%${query}%`,
        },
      },
    });
    res.json(clientePotencial);
  } catch (error) {
    next(error);
  }
};

const descargarClientesPotencialesExcel = async (req, res, next) => {
  try {
    const clientes = await ClientesPotenciales.findAll({
      include: {
        model: Servicios,
        attributes: ["nombre"],
      },
    });

    const workbook = await ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Clientes Potenciales");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Nombre", key: "nombre", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Teléfono", key: "telefono", width: 20 },
      { header: "Mensaje", key: "mensaje", width: 50 },
      { header: "Servicio", key: "servicio", width: 10 },
    ];

    clientes.forEach((cliente) => {
      worksheet.addRow({
        id: cliente.id,
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: cliente.telefono,
        mensaje: cliente.mensaje,
        servicio: cliente.Servicio ? cliente.Servicio.nombre : "N/A",
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=clientes_potenciales.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};

const descargarClientesPotencialesPDF = async (req, res, next) => {
  try {
    const clientes = await ClientesPotenciales.findAll({
      include: {
        model: Servicios,
        attributes: ["nombre"],
      },
    });

    const doc = new PDFDocument();
    let filename = "clientes_potenciales.pdf";

    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(16).text("Clientes Potenciales", { align: "center" });

    clientes.forEach((cliente) => {
      doc
        .fontSize(12)
        .text(`ID: ${cliente.id}`)
        .text(`Nombre: ${cliente.nombre}`)
        .text(`Email: ${cliente.email}`)
        .text(`Teléfono: ${cliente.telefono}`)
        .text(`Mensaje: ${cliente.mensaje}`)
        .text(`Servicio: ${cliente.Servicio ? cliente.Servicio.nombre : 'N/A'}`)
        .moveDown();
    });
    doc.end();

  } catch (error) {
    next(error);
  }
};

module.exports = {
  nuevoClientePotencial,
  mostrarClientesPotenciales,
  mostrarClientePotencial,
  buscarClientePotencial,
  eliminarClientePotencial,
  descargarClientesPotencialesExcel,
  descargarClientesPotencialesPDF,
};
