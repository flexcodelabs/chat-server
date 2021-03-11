"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class ConnectionsRequests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ConnectionsRequests.init(
    {
      requester: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false,
      },
      addressee: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ConnectionsRequests",
      tableName: "connections_requests",
    }
  )
  return ConnectionsRequests
}
