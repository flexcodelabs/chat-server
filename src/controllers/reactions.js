const { AuthenticationError, UserInputError } = require("apollo-server")
const { Op } = require("sequelize")
const { Chats, sequelize, Messages, Reactions } = require("../../models")

exports.react = async (_, { id }, { user }) => {
  try {
  } catch (err) {}
}

exports.unreact = async (_, { id }, { user }) => {
  try {
  } catch (err) {}
}
