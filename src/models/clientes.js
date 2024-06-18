'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clientes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Clientes.belongsTo(models.Usuarios, {foreignKey: 'userId'});
    }
  }
  Clientes.init({
    nombre: DataTypes.STRING,
    documento: DataTypes.STRING,
    direccion: DataTypes.STRING,
    email: DataTypes.STRING,
    telefono: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Clientes',
  });
  return Clientes;
};