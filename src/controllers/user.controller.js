const { Usuarios, Servicios, Roles } = require("../models");
const { sendWelcomeEmail } = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const regitrarUsuario = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const user = await Usuarios.create({
      nombre,
      apellido,
      email,
      password: hashed,
    });
    res.json(user);

    /**Mandar un Token para identificar esta acción*/
    const verifyToken = jwt.sign({ nombre, email }, process.env.JWT_SECRET_EMAIL_VALID, {
        algorithm: "HS512",
        expiresIn: "12h",
      }
    );

    sendWelcomeEmail(email, { nombre, verifyToken });
  } catch (error) {
    next(error);
  }
};

const autenticarUsuario = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Usuarios.findOne({
      where: { email },
    });

    if (!user) {
      return next({
        status: 400,
        name: "Email Inválido",
        message: "Email no existe",
      });
    }

    // Verificar si se valida el email
    // if (!user.validEmail) {
    //   return next({
    //     status: 400,
    //     name: "Email no está verificada",
    //     message: "Usuario necesita verificar su correo electrónico.",
    //   });
    // }

    // Comparamos la contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return next({
        status: 400,
        name: "Password incorrecto",
        message: "Password no coincide  con el email del usuario",
      });
    }
    const { id, nombre, apellido, validEmail, rolId } = user;

    // Generar token
    const userData = {id, nombre, apellido, validEmail, rolId};
    const token = jwt.sign(userData, process.env.JWT_SECRET_LOGIN, {
      algorithm: "HS512",
      expiresIn: "2h",
    });

    userData.token = token;
    res.json(userData);

  } catch (error) {
    next(error);
  }
};

const mostrarUsuarios = async (req, res, next) => {
  try {
    // Obtener todos los usuarios excluyendo el campo 'password' y incluyendo los roles
    const users = await Usuarios.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);

  } catch (error) {
    next(error);
  }
};

const mostrarUsuario = async (req, res, nex) => {
  try {
    const { id } = req.params;
    const usuario = await Usuarios.findByPk(id, {
      attributes: { exclude: ["password"] }
    });

    if (!usuario) {
      res.json({
        mensaje: "El usuario no existe",
      });
    }
    res.json(usuario);
  } catch (error) {
    nex(error);
  }
};

const eliminarUsuario = async (req, res, next) => {
  try {
    const userId = req.params.id;

    //Buscar el usuario por su id
    const users = await Usuarios.findOne({ where: { id: userId } });

    if (!users) {
      return next({
        status: 404,
        name: "Usuario incorrecto",
        message: "El usuario no existe",
      });
    }

    // Verificar si el usuario tiene servicios asociados
    let service = await Servicios.findAll({ where: { userId: users.id } });

    if (service.length > 0) {
      return res.status(400).json({
        message: "El usuario tiene servicios asociados",
      });
    }

    // Elimina el usuario
    await Usuarios.destroy({ where: { id: userId } });

    //Respuesta exitosa
    return res.status(200).json({
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

const actualizarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, rolId } = req.body;
    const nuevaImagen = req.file ? req.file.filename : null;

    const usuario = await Usuarios.findByPk(id);
    if (!usuario) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    //verificar el directorio actual
    //console.log('__dirname: ', __dirname);

    // Eliminar la imagen anterior si hay una nueva imagen cargada
    if (nuevaImagen && usuario.avatar) {
      const oldImagePath = path.join(__dirname, '..', '..', 'uploads', usuario.avatar);
      
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      } 
    }

    usuario.email = email;
    usuario.rolId = rolId;
    usuario.nombre = nombre;
    usuario.apellido = apellido;
    if (nuevaImagen) {
      usuario.avatar = nuevaImagen;
    }

    const guardarUsuario = await usuario.save();
    res.json(guardarUsuario);

  } catch (error) {
    if (req.file) {
      const newImagePath = path.join(__dirname, '..', '..', 'uploads', req.file.filename);
      if (fs.existsSync(newImagePath)) {
        fs.unlinkSync(newImagePath);
      }
    }
    next(error);
  }
};

const buscarUsuario = async (req, res, next) => {
  try {
    const { query } = req.params;
    const usuarios = await Usuarios.findAll({
      where: {
        nombre: {
          [Op.iLike]: `%${query}%`,
        },
      },
    });
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
};

const validarEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET_EMAIL_VALID, {
      algorithms: "HS512",
    });

    //Verificamos el token
    if (!decoded) {
      next({
        status: 400,
        name: "Error de verificación",
        message: "Algo sucedió con la verificación, solicite nuevamente",
      });
    }

    //token es válido
    await Usuarios.update({ validEmail: true }, {
      where: { email: decoded.email },
    });
    res.status(204).send();

  } catch (error) {
    next(error);
  }
};

module.exports = {
  regitrarUsuario,
  autenticarUsuario,
  mostrarUsuario,
  mostrarUsuarios,
  eliminarUsuario,
  actualizarUsuario,
  buscarUsuario,
  validarEmail,
};
