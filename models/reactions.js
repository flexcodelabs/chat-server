"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Reactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Messages, Users }) {
      // define association here
      this.belongsTo(Messages, { foreignKey: "messageId" }) // MessageId, messageId
      this.belongsTo(Users, { foreignKey: "userId" })
    }
  }
  Reactions.init(
    {
      messageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reaction: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Reactions",
      tableName: "reactions",
    }
  )
  return Reactions
}
