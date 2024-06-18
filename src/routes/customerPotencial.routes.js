const { Router } = require("express");
const { nuevoClientePotencial, mostrarClientesPotenciales, mostrarClientePotencial, descargarClientesPotencialesExcel, descargarClientesPotencialesPDF, buscarClientePotencial } = require("../controllers/customerPotencial.controller");

const router = Router();

router.post("/clientes-potenciales", nuevoClientePotencial);
router.get("/clientes-potenciales", mostrarClientesPotenciales);
router.get("/clientes-potenciales/:id", mostrarClientePotencial);
router.post("/clientes-potenciales/busqueda/:query", buscarClientePotencial)
router.get("/clientes-potenciales/excel", descargarClientesPotencialesExcel);
router.get("/clientes-potenciales/pdf", descargarClientesPotencialesPDF);

module.exports = router;