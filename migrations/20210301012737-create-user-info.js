"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user_info", {
      userId: {
        type: Sequelize.BIGINT(11),
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      about: Sequelize.TEXT("long"),
      bio: Sequelize.STRING,
      DOB: Sequelize.DATE,
      dp: Sequelize.STRING,
      cover_image: Sequelize.STRING,
      location: Sequelize.STRING,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user_info")
  },
}
