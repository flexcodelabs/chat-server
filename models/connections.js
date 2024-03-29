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
      userId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false,
      },
      connectedTo: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(1),
        allowNull: false,
      },
      active_user_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false,
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
