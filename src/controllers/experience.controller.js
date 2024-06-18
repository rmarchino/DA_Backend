const fs = require("fs");
const path = require("path");
const { Experiencias, Usuarios } = require("../models");

const nuevoExperiencia = async (req, res, next) => {
  try {
    const { nombre, userId } = req.body;
    let imagen = null;
    if (req.file) {
      imagen = req.file.filename;
    }

    const user = await Usuarios.findByPk(userId);
    if (!user) {
      return res.status(400).json({
        error: "Usuario no encontrado",
      });
    }

    const experiencia = await Experiencias.create({
      nombre,
      userId,
      imagen,
    });
    res.json({ message: "Se agregó una nueva experiencia", experiencia });

  } catch (error) {
    const newImagePath = path.join( __dirname, "..", "..", "images/experiencia", req.file.filename);
    if (fs.existsSync(newImagePath)) {
      fs.unlinkSync(newImagePath);
    }
    next(error);
  }
};

const mostrarExperiencias = async (req, res, next) => {
  try {
    const experiencias = await Experiencias.findAll({
      include: {
        model: Usuarios,
        attributes: ["nombre"],
      },
    });
    res.json(experiencias);
  } catch (error) {
    next(error);
  }
};

const mostrarExperiencia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const experiencia = await Experiencias.findByPk(id, {
      include: {
        model: Usuarios,
        attributes: ["nombre"],
      },
    });

    if (!experiencia) {
      res.json({
        status: 404,
        name: "Experiencia incorrecto",
        message: "El experiencia no existe",
      });
    }
    res.json(experiencia);
  } catch (error) {
    next(error);
  }
};

const actualizarExperiencia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, userId } = req.body;
    const nuevaImagen = req.file ? req.file.filename : null;

    const experiencia = await Experiencias.findByPk(id);
    if (!experiencia) {
      return res.status(404).json({
        error: "Experiencia no encontrado",
      });
    }

    // Eliminar la imagen anterior si hay una nueva imagen cargada
    if (nuevaImagen && experiencia.imagen) {
      const oldImagePath = path.join( __dirname, "..", "..", "images/experiencia", experiencia.imagen);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    experiencia.nombre = nombre;
    experiencia.userId = userId;
    if (nuevaImagen) {
      experiencia.imagen = nuevaImagen;
    }

    const guardarExperiencia = await experiencia.save();
    res.status(200).json({
        message: "Experiencia actualizado correctamente",
        guardarExperiencia,
    });

  } catch (error) {
    const newImagePath = path.join( __dirname, "..", "..", "images/experiencia", req.file.filename);
    if (fs.existsSync(newImagePath)) {
      fs.unlinkSync(newImagePath);
    }
    next(error);
  }
};

const eliminarExperiencia = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Buscar la experiencia por su id
    const experiencia = await Experiencias.findByPk(id);
    if (!experiencia) {
      return res.status(404).json({
        error: "Experiencia no encontrada",
      });
    }

    // Eliminar la imagen asociada si existe
    if (experiencia.imagen) {
      const imagePath = path.join( __dirname, "..", "..", "images/experiencia", experiencia.imagen);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await experiencia.destroy();
    res.json({ message: "Experiencia eliminado con éxito" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  nuevoExperiencia,
  mostrarExperiencias,
  mostrarExperiencia,
  eliminarExperiencia,
  actualizarExperiencia,
};
