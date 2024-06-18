'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Servicios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Servicios.hasMany(models.ClientesPotenciales, {foreignKey: 'servicioId'});
      Servicios.belongsTo(models.Usuarios, {foreignKey: 'userId'});
    }
  }
  Servicios.init({
    nombre: DataTypes.STRING,
    precio: DataTypes.STRING,
    imagen: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    descripcionDetalle: DataTypes.STRING,
    disponible: DataTypes.BOOLEAN,
    creadoPor: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Servicios',
  });
  return Servicios;
};