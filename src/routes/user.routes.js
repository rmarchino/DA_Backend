const { Router } = require("express");
const {
  mostrarUsuarios,
  regitrarUsuario,
  eliminarUsuario,
  actualizarUsuario,
  autenticarUsuario,
  buscarUsuario,
  mostrarUsuario,
  validarEmail,
} = require("../controllers/user.controller");

const {
  createUserValidator,
  loginUserValidator,
} = require("../validators/users.validators");

const { subirAvatar } = require("../utils/multer");
//const { recortarImgAvatar } = require("../utils/resizeSharpImage");

const router = Router();

router.get("/usuarios", mostrarUsuarios);
router.get("/usuarios/:id", mostrarUsuario);
router.delete("/usuarios/:id", eliminarUsuario);
router.post("/usuarios/email-validate", validarEmail);
router.post("/usuarios/busqueda/:query", buscarUsuario);
router.post("/crear-cuenta", createUserValidator, regitrarUsuario);
router.post("/iniciar-sesion", loginUserValidator, autenticarUsuario);
router.put("/usuarios/:id", subirAvatar.single('avatar'), actualizarUsuario);

module.exports = router;
