const fs = require("fs");
const path = require("path");
const { Servicios, Usuarios } = require("../models");

const nuevoServicio = async (req, res, next) => {
  try {
    const {
      nombre,
      precio,
      descripcion,
      descripcionDetalle,
      userId,
    } = req.body;

    let imagen = null;
    if (req.file) {
      imagen = req.file.filename;
    }

    //Obtener el ID del usuario authenticado
    //const userId = req.user.id;

    const user = await Usuarios.findByPk(userId);
    if (!user) {
      return res.status(400).json({
        error: "Usuario no encontrado",
      });
    }

    const servicio = await Servicios.create({
      nombre,
      precio,
      descripcion,
      descripcionDetalle,
      userId,
      imagen,
    });
    res.json({ message: "Se agregó un nuevo servicio", servicio });
  } catch (error) {
    const newImagePath = path.join(__dirname, "..", "..", "uploads", req.file.filename);
    if (fs.existsSync(newImagePath)) {
      fs.unlinkSync(newImagePath);
    }
    next(error);
  }
};

const mostrarServicios = async (req, res, next) => {
  try {
    const servicios = await Servicios.findAll({
      attributes: { exclude: ["creadoPor", "userId"] },
      include: {
        model: Usuarios,
        attributes: ["nombre"],
      },
    });
    res.json(servicios);
  } catch (error) {
    next(error);
  }
};

const mostrarServicio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const servicio = await Servicios.findByPk(id, {
      attributes: { exclude: ["creadoPor", "userId"] },
      include: {
        model: Usuarios,
        attributes: ["nombre"],
      },
    });

    if (!servicio) {
      res.json({
        status: 404,
        name: "Servicio incorrecto",
        message: "El servicio no existe",
      });
    }
    res.json(servicio);
  } catch (error) {
    next(error);
  }
};

const eliminarServicio = async (req, res, next) => {
  try {
    const servicioId = req.params.id;

    //Buscar el servicio por su id
    const service = await Servicios.findOne({ where: { id: servicioId } });

    if (!service) {
      return next({
        status: 404,
        name: "Servicio incorrecto",
        message: "El servicio no existe",
      });
    }

    // Eliminar la imagen asociada si existe
    if (service.imagen) {
      const imagePath = path.join(__dirname, "..", "..", "uploads", service.imagen);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    //eliminar el servicio
    await Servicios.destroy({ where: { id: servicioId } });

    return res.json({
      message: "Servicio eliminado con éxito",
    });
  } catch (error) {
    next(error);
  }
};

const actualizarServicio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const nuevoServicio = req.body;
    const nuevaImagen = req.file ? req.file.filename : null;

    //Definir servicio anterior
    let servicioAnterior;

    //verificar si hay imagen nueva
    if (req.file) {
      // Si hay una nueva imagen, obtener el producto anterior de bd
      servicioAnterior = await Servicios.findByPk(id);
      if (!servicioAnterior) {
        return res.status(404).json({
          error: "Servicio no encontrado",
        });
      }
      nuevoServicio.imagen = req.file.filename;

      // Eliminar la imagen anterior si hay una nueva imagen cargada
      if (servicioAnterior.imagen && nuevaImagen !== servicioAnterior.imagen) {
        const oldImagePath = path.join(__dirname, "..", "..", "uploads", servicioAnterior.imagen);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

    } else {
      // Si no hay una nueva imagen, mantener la imagen del producto anterior
      servicioAnterior = await Servicios.findByPk(id);
      nuevoServicio.imagen = servicioAnterior.imagen;
    }

    //Actualizar el servicio en la base de datos
    await Servicios.update(nuevoServicio, {
      where: { id: id }
    });

    //Obtener el producto actualizado
    const servicioActualizado = await Servicios.findByPk(id);
    res.json(servicioActualizado);

  } catch (error) {
    // Eliminar la nueva imagen cargada en caso de error
    if (req.file) {
      const newImagePath = path.join(__dirname, "..", "..", "uploads", req.file.filename);
      if (fs.existsSync(newImagePath)) {
        fs.unlinkSync(newImagePath);
      }
    }
    next(error);
  }
};

const buscarServicio = async (req, res, next) => {
  try {
    const { query } = req.params;
    const servicios = await Servicios.findAll({
      where: {
        nombre: {
          [Op.iLike]: `%${query}%`,
        },
      },
    });
    res.json(servicios);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  nuevoServicio,
  mostrarServicios,
  mostrarServicio,
  eliminarServicio,
  actualizarServicio,
  buscarServicio,
};
