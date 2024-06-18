const { Router } = require("express");
const { nuevoCliente, mostrarClientes, mostrarCliente, eliminarCliente, actualizarCliente, buscarCliente } = require("../controllers/customer.controller");
const authenticate = require('../middlewares/auth.middleware');


const router = Router();

router.post("/clientes", nuevoCliente);
router.get("/clientes", mostrarClientes);
router.get("/clientes/:id", mostrarCliente);
router.delete("/clientes/:id", authenticate, eliminarCliente);
router.put("/clientes/:id", actualizarCliente);
router.post("/clientes/busqueda/:query", buscarCliente);



module.exports = router;