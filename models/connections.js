"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Connections extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Connections.init(
    {
      user_one: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_two: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Connections",
      tableName: "connections",
    }
  )
  return Connections
}
