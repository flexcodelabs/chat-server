"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Follow.init(
    {
      user: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false,
      },
      follows: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Follow",
      tableName: "follows",
    }
  )
  return Follow
}
