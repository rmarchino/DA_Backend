const { Router } = require("express");
const { nuevoServicio, mostrarServicios, mostrarServicio, eliminarServicio, actualizarServicio, buscarServicio} = require("../controllers/service.controller");
const { subirImagenServicio } = require("../utils/multer");
const nuevoServicioValidator = require("../validators/services.validator");


const router = Router();

router.post("/servicios", subirImagenServicio.single('imagen'), nuevoServicioValidator, nuevoServicio);
router.get("/servicios", mostrarServicios);
router.get("/servicios/:id", mostrarServicio);
router.delete("/servicios/:id", eliminarServicio);
router.post("/servicios/busqueda/:query", buscarServicio)
router.put("/servicios/:id", subirImagenServicio.single('imagen'), nuevoServicioValidator, actualizarServicio);




module.exports = router;