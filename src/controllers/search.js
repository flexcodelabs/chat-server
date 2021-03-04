const { UserInputError, AuthenticationError } = require("apollo-server")
const { Op } = require("sequelize")

const { Users } = require("../../models")

exports.searchProfile = async (_, { keyword }) => {
  return keyword
}
