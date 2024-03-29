"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("connections", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        allowNull: false,
      },
      connectedTo: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(1),
        allowNull: false,
      },
      active_user_id: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        allowNull: false,
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
    await queryInterface.dropTable("connections")
  },
}
