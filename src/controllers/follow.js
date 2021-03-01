const { Follow, Users } = require("../../models")
const { Op } = require("sequelize")
const { UserInputError, AuthenticationError } = require("apollo-server")
const { sequelize } = require("../../models")

exports.follow = async (_, { id }, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let warning = {}
  try {
    if (user.id === id) {
      warning.msg = "You can't follow yourself"
      throw new UserInputError("Bad Input", warning)
    }
    let check = await Follow.findOne({
      where: {
        [Op.and]: [{ user: user.id }, { follows: id }],
      },
    })
    if (check) {
      warning.msg = "You already followed this user"
      throw new UserInputError("Bad Input", warning)
    } else {
      let following = await Follow.create({
        user: user.id,
        follows: id,
      })
      return following
    }
  } catch (err) {
    throw err
  }
}

exports.unfollow = async (_, { id }, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let warning = {}
  try {
    let check = await Follow.findOne({
      where: {
        id,
      },
    })
    if (check && check.user === user.id) {
      let unfollowing = await Follow.destroy({
        where: {
          id,
        },
      })
      console.log(unfollowing)
      return check
    } else {
      warning.msg = "Unauthorized"
      throw new UserInputError("Bad Input", warning)
    }
  } catch (err) {
    throw err
  }
}

exports.getFollowers = async (_, __, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  try {
    const [results, metadata] = await sequelize.query(
      `SELECT username FROM users WHERE id IN(SELECT user FROM follows WHERE follows=${user.id})`
    )

    return results
  } catch (err) {
    throw err
  }
}

exports.getFollowings = async (_, __, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")

  try {
    const [results, metadata] = await sequelize.query(
      `SELECT username FROM users WHERE id IN(SELECT follows FROM follows WHERE user=${user.id})`
    )
    return results
  } catch (err) {
    throw err
  }
}
