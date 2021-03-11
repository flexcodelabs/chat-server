"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("chats", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_one: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        allowNull: false,
      },
      user_two: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        allowNull: false,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defautValue: false,
      },
      active_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defautValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("chats")
  },
}
