const { validationResult } = require("express-validator");

const validateResult = (req, res, next) => {
  try {
    validationResult(req).throw();
    return next();
    
  } catch (error) {
    next({
      status: 400,
      name: "Error en la validación",
      message: error.errors.map((error) => error.msg),
    });
  }
};

module.exports = validateResult;
