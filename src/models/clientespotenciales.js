'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClientesPotenciales extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ClientesPotenciales.belongsTo(models.Servicios, {foreignKey: 'servicioId'});
    }
  }
  ClientesPotenciales.init({
    nombre: DataTypes.STRING,
    email: DataTypes.STRING,
    mensaje: DataTypes.STRING,
    telefono: DataTypes.STRING,
    servicioId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ClientesPotenciales',
  });
  return ClientesPotenciales;
};