const { Usuarios, Clientes } = require("../models");

const nuevoCliente = async (req, res, next) => {
  try {
    const { nombre, documento, email, telefono, direccion, userId } = req.body;

    //Obtener el ID del usuario authenticado
    //const userId = req.user.id;

    // const user = await Usuarios.findByPk(userId);
    // if (!user) {
    //   return res.status(400).json({
    //     error: "Usuario no encontrado",
    //   });
    // }

    const cliente = await Clientes.create({
      nombre,
      documento,
      email,
      telefono,
      direccion,
      userId,
    });

    res.json({ message: "Se agregó un nuevo servicio", cliente });
  } catch (error) {
    next(error);
  }
};

const mostrarClientes = async (req, res, next) => {
  try {
    const clientes = await Clientes.findAll({
      attributes: { exclude: ["userId"] },
      include: {
        model: Usuarios,
        attributes: ["nombre"],
      },
    });
    res.json(clientes);
  } catch (error) {
    next(error);
  }
};

const mostrarCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cliente = await Clientes.findByPk(id, {
      attributes: { exclude: ["userId"] },
      include: {
        model: Usuarios,
        attributes: ["nombre"],
      },
    });

    if (!cliente) {
      res.json({
        status: 404,
        name: "Cliente incorrecto",
        message: "El cliente no existe",
      });
    }
    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

const eliminarCliente = async (req, res, next) => {
  try {
    const clienteId = req.params.id;

    //Buscar el servicio por su id
    const cliente = await Clientes.findOne({ where: { id: clienteId } });

    if (!cliente) {
      return next({
        status: 404,
        name: "Cliente incorrecto",
        message: "El cliente no existe",
      });
    }

    //eliminar el servicio
    await Clientes.destroy({ where: { id: clienteId } });

    return res.json({
      message: "Cliente eliminado con éxito",
    });
  } catch (error) {
    next(error);
  }
};

const actualizarCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, documento, email, telefono, direccion, userId } = req.body;

    const cliente = await Clientes.findByPk(id);
    if (!cliente) {
      return res.status(404).json({
        error: "Cliente no encontrado",
      });
    }

    cliente.nombre = nombre;
    cliente.documento = documento;
    cliente.email = email;
    cliente.telefono = telefono;
    cliente.direccion = direccion;
    cliente.userId = userId;

    const guardarCliente = await cliente.save();
    res.json(guardarCliente);
  } catch (error) {
    next(error);
  }
};

const buscarCliente = async (req, res, next) => {
  try {
    const { query } = req.params;
    const clientes = await Clientes.findAll({
      where: {
        nombre: {
          [Op.iLike]: `%${query}%`,
        },
      },
    });
    res.json(clientes);
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  nuevoCliente,
  mostrarClientes,
  mostrarCliente,
  eliminarCliente,
  actualizarCliente,
  actualizarCliente,
  buscarCliente,
};
