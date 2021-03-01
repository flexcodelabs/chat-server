"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init(
    {
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      middle_name: {
        type: DataTypes.STRING(50),
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: "must be a valid email address",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
      },
      account_status: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      deleted_status: {
        type: DataTypes.BOOLEAN,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      verification_code: {
        type: DataTypes.BIGINT(11),
      },
      confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      suspendedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Users",
      tableName: "users",
    }
  )
  return Users
}
