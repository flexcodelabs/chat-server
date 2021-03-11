"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Chats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Chats.init(
    {
      user_one: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false,
      },
      user_two: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defautValue: false,
      },
      active_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defautValue: false,
      },
    },
    {
      sequelize,
      modelName: "Chats",
      tableName: "chats",
    }
  )
  return Chats
}
