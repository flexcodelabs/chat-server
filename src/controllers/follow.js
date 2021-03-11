const { Follow, Connections, Users, sequelize } = require("../../models")
const { Op } = require("sequelize")
const { UserInputError, AuthenticationError } = require("apollo-server")

exports.follow = async (_, { id }, { user, pubsub }) => {
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
    let statusCheck = await Connections.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ userId: user.id }, { connectedTo: id }],
          },
          {
            [Op.and]: [{ userId: id }, { connectedTo: user.id }],
          },
        ],
        status: "B",
        active_user_id: id,
      },
    })
    let userCheck = await Users.findOne({
      where: { id },
    })
    if (!userCheck) warning.msg = "This user doesn't exists"
    if (statusCheck && statusCheck.status === "B")
      warning.msg = "Can't follow this user"
    if (check) warning.msg = "You already followed this user"

    if (Object.keys(warning).length > 0) {
      throw new UserInputError("Bad Input", warning)
    } else {
      let following = await Follow.create({
        user: user.id,
        follows: id,
      })
      let userData
      if (following) {
        userData = await Users.findOne({
          where: {
            id: user.id,
          },
        })
      }
      console.log(userData)
      pubsub.publish("NEW_FOLLOWER", {
        newFollower: { ...userData.toJSON(), userId: following.follows },
      })
      console.log("success")

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
        [Op.and]: [{ user: user.id }, { follows: id }],
      },
    })
    if (check && check.user === user.id) {
      let unfollowing = await Follow.destroy({
        where: {
          [Op.and]: [{ user: user.id }, { follows: id }],
        },
      })
      console.log("success")
      return { ...check.toJSON(), unfollowing }
    } else {
      warning.msg = "Unauthorized"
      console.log("error")
      throw new UserInputError("Bad Input", warning)
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

exports.getFollowers = async (_, { id }) => {
  // if (!user) throw new AuthenticationError("Unauthenticated")
  try {
    const [results, metadata] = await sequelize.query(
      `SELECT * FROM users WHERE id IN(SELECT user FROM follows WHERE follows=${id})`
    )

    return results
  } catch (err) {
    throw err
  }
}

exports.getFollowings = async (_, { id }) => {
  // console.log(user)
  // if (!user) throw new AuthenticationError("Unauthenticated")

  try {
    const [results, metadata] = await sequelize.query(
      `SELECT * FROM users WHERE id IN(SELECT follows FROM follows WHERE user=${id})`
    )
    return results
  } catch (err) {
    throw err
  }
}

exports.getFollowersCount = async (_, { id }) => {
  // if (!user) throw new AuthenticationError("Unauthenticated")
  try {
    let count = await Follow.count({
      where: {
        follows: id,
      },
    })
    return count
  } catch (err) {
    throw err
  }
}

exports.getFollowingsCount = async (_, { id }) => {
  // if (!user) throw new AuthenticationError("Unauthenticated")
  try {
    let count = await Follow.count({
      where: {
        user: id,
      },
    })
    return count
  } catch (err) {
    throw err
  }
}

exports.checkFollowing = async (_, { id }, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  try {
    let check = await Follow.findOne({
      where: {
        [Op.and]: [{ user: user.id }, { follows: id }],
      },
    })
    if (check) {
      return true
    } else {
      return false
    }
  } catch (err) {
    throw err
  }
}
