const { UserInputError } = require("apollo-server")
const { Op } = require("sequelize")
const { sequelize } = require("../../models")

exports.searchProfile = async (_, { keyword }) => {
  let key = keyword
  if (key.trim() === "") {
    throw new UserInputError("Bad Input")
  }
  try {
    const [results, metadata] = await sequelize.query(
      `select * from users where first_name like '%${key}%' or last_name like '%${key}%' or username like '%${key}%' or title like '%${keyword}%'`
    )

    return results
  } catch (err) {
    throw err
  }
}
