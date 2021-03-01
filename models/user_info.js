"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class User_Info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_Info.init(
    {
      userId: {
        type: DataTypes.BIGINT(11),
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      about: DataTypes.TEXT("long"),
      bio: DataTypes.STRING,
      DOB: DataTypes.DATE,
      dp: DataTypes.STRING,
      cover_image: DataTypes.STRING,
      location: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User_Info",
      tableName: "user_info",
    }
  )
  return User_Info
}
