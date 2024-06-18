const { check, body } = require("express-validator");
const validateResult = require("../utils/validate");

const nuevoExperienciaValidator = [
  check("nombre", "Error en el campo nombre")
    .exists()
    .withMessage("nombre es obligatoio")
    .notEmpty()
    .trim()
    .withMessage("nombre no debe de estar vacío")
    .isString()
    .withMessage("El tipo de dato debe de ser estring")
    .isLength({ max: 60 })
    .withMessage("El nombre debe tener máximo 60 caracteres"),

  check("userId", "Error en el campo userId")
    .exists()
    .withMessage("userId es obligatoio")
    .notEmpty()
    .trim()
    .withMessage("userId no debe de estar vacío")
    .isInt()
    .withMessage("El tipo de dato debe de ser entero"),

  body("imagen").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("El campo de archivo imagen es requerido");
    }
    return true;
  }),

  validateResult,
];

module.exports = nuevoExperienciaValidator;
