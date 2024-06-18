const { check } = require("express-validator");
const validateResult = require("../utils/validate");

const nuevoServicioValidator = [
  check("nombre", "Error en el campo nombre")
    .notEmpty()
    .withMessage("nombre no debe de estar vacío")
    .isString()
    .withMessage("El tipo de dato debe de ser estring"),

  check("descripcion", "Error en el campo descripcion")
    .isString()
    .withMessage("El tipo de dato debe de ser estring"),

  check("descripcionDetalle", "Error en el campo descripcionDetalle")
    .isString()
    .withMessage("El tipo de dato debe de ser estring"),

  check("precio", "Error en el campo precio")
    .isFloat()
    .withMessage("El tipo de dato debe de ser decimal"),
  validateResult

];

module.exports = nuevoServicioValidator;
