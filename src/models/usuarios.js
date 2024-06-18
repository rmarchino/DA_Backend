'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuarios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Usuarios.hasMany(models.Clientes, {foreignKey: 'userId'});
      Usuarios.hasMany(models.Experiencias, {foreignKey: 'userId'});
      Usuarios.hasMany(models.Servicios, {foreignKey: 'userId'});
    }
  }
  Usuarios.init({
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    validEmail: DataTypes.BOOLEAN,
    avatar: DataTypes.STRING,
    typeRol: {
      type: DataTypes.ENUM('Admin', 'user'),
      allowNull: false,
      defaultValue: 'user'
    }

  }, {
    sequelize,
    modelName: 'Usuarios',
  });
  return Usuarios;
};