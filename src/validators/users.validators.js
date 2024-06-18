const { check } = require("express-validator");
const validateResult = require("../utils/validate");

const createUserValidator = [
  check("nombre", "Error en el campo nombre")
    .exists()
    .withMessage("nombre es obligatoio")
    .notEmpty()
    .withMessage("El nombre no debe de estar vacío")
    .isString()
    .withMessage("El tipo de dato debe de ser estring")
    .isLength({ max: 30 })
    .withMessage("El nombre debe tener máximo 30 caracteres"),

  check("apellido", "Error en el campo apellido")
    .exists()
    .withMessage("El apellido es obligatorio")
    .notEmpty()
    .withMessage("El apellido no debe de estar vacío")
    .isString()
    .withMessage("El tipo de dato del apellido debe de ser string")
    .isLength({ max: 30 })
    .withMessage("El apellido debe tener máximo 30 caractéres"),

  check("email", "Error en el campo email")
    .exists()
    .withMessage("El email es obligatorio")
    .notEmpty()
    .withMessage("El email no debe de estar vacío")
    .isString()
    .withMessage("El email debe ser un string")
    .isEmail()
    .withMessage("El email no tiene formato de correo")
    .isLength({ min: 8, max: 50 })
    .withMessage("El email debe tener minimo 8 caracteres y máximo 50"),

  check("password", "Error con el campo password")
    .exists()
    .withMessage("El password es obligatorio")
    .notEmpty()
    .withMessage("El password no puede estar vacio")
    .isString()
    .withMessage("El password debe ser un string")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%-^&*])[A-Za-z\d!@#$%-^&*]{8,}$/
    )
    .withMessage(
      "La contraseña debe tener minimo 8 caracteres una mayuscula, una minuscula, un numero y un caracter especial"
    ),

  validateResult,
];

const loginUserValidator = [
  check("email", "Error con el campo email")
    .exists()
    .withMessage("email is obligatorio")
    .notEmpty()
    .withMessage("email no puede estar vacío")
    .isEmail()
    .withMessage("email no tiene formato de correo")
    .isLength({ min: 10, max: 50 })
    .withMessage("El email debe tener minimo 10 caracteres y máximo 50"),

  check("password", "Error con el campo password")
    .exists()
    .withMessage("password es obligatorio")
    .notEmpty()
    .withMessage("password no puede estar vacío")
    .isString()
    .withMessage("password debe ser string")
    .isLength({ min: 8 })
    .withMessage("El password debe tener minimo 8 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%-^&*])[A-Za-z\d!@#$%-^&*]{8,}$/
    )
    .withMessage(
      "La contraseña debe tener minimo 8 caracteres una mayuscula, una minuscula, un numero y un caracter especial"
    ),

  validateResult,
];

module.exports = {
  createUserValidator,
  loginUserValidator,
};
