const { Router } = require("express");
const { nuevoExperiencia, actualizarExperiencia, mostrarExperiencias, mostrarExperiencia, eliminarExperiencia } = require("../controllers/experience.controller");
const { subirImagenExperiencia } = require("../utils/multer");
const nuevoExperienciaValidator = require("../validators/experience.validator");

const router = Router();

router.post("/experiencias", subirImagenExperiencia.single('imagen'), nuevoExperienciaValidator, nuevoExperiencia );
router.get("/experiencias", mostrarExperiencias );
router.get("/experiencias/:id", mostrarExperiencia );
router.delete("/experiencias/:id", eliminarExperiencia );
router.put("/experiencias/:id", subirImagenExperiencia.single('imagen'), nuevoExperienciaValidator, actualizarExperiencia );

module.exports = router;
