const { Connections, Users } = require("../../models")
const { Op } = require("sequelize")
const { UserInputError, AuthenticationError } = require("apollo-server")
const { sequelize } = require("../../models")

exports.requestConnection = async (_, args, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let { user_two } = args
  let warning = {}
  try {
    //   check if user_two is not uauthenticated user
    if (user_two === user.id) {
      warning.msg = "Cant request a connection with yourself"
      throw new UserInputError("Bad Input", { warning })
    }

    // check if second user exists
    let secondUser = await Users.findOne({
      where: {
        id: user_two,
      },
      attributes: ["id"],
    })

    // check if a connection exists
    let check = await Connections.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ user_one: user.id }, { user_two: user_two }],
          },
          {
            [Op.and]: [{ user_one: user_two }, { user_two: user.id }],
          },
        ],
      },
      attributes: ["id"],
    })

    if (!secondUser) {
      warning.msg = "This user doesn't exists"
      throw new UserInputError("Bad Input", { warning })
    }

    if (check && check.confirmed === true) {
      warning.msg = "Request was already made with this user"
      throw new UserInputError("Bad Input", { warning })
    }
    if (check) {
      warning.msg = "You are already connected"
      throw new UserInputError("Bad Input", { warning })
    } else {
      let connect = await Connections.create({
        user_one: user.id,
        user_two,
      })
      return connect
    }
  } catch (err) {
    throw new UserInputError("Bad Input", { warning })
  }
}

exports.acceptConnection = async (_, { id }, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let warning = {}
  try {
    //   checks for the existing connection
    let connection = await Connections.findOne({
      where: {
        id,
      },
    })
    if (
      connection &&
      connection.user_two === user.id &&
      connection.confirmed === false
    ) {
      let accept = await Connections.update(
        {
          confirmed: true,
        },
        {
          where: {
            id,
          },
        }
      )
      console.log(accept)
      return connection
    } else if (
      connection &&
      connection.user_two === user.id &&
      connection.confirmed === true
    ) {
      warning.msg = "Request already accepted"
      throw new UserInputError("Bad Input", { warning })
    } else if (connection && connection.user_one === user.id) {
      warning.msg = "You can't accept your own request"
      throw new UserInputError("Bad Input", { warning })
    } else {
      warning.msg = "Request doesn't exist"
      throw new UserInputError("Bad Input", { warning })
    }
  } catch (err) {
    throw err
  }
}

exports.rejectConnection = async (_, { id }, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let warning = {}
  try {
    let connection = await Connections.findOne({
      where: {
        id,
      },
    })
    if (
      connection &&
      (connection.user_one === user.id || connection.user_two === user.id)
    ) {
      let deleteConnection = await Connections.destroy({
        where: {
          id: id,
        },
      })
      console.log(deleteConnection)
      return connection
    } else {
      warning.msg = "Unauthorized"
      throw new UserInputError("Bad Input", { warning })
    }
  } catch (err) {
    throw err
  }
}

getConnectionRequests = async (_, __, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
}

getUnacceptedRequests = async (_, __, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
}

exports.getConnections = async (_, __, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let error = null
  Connections.belongsTo(Users)
  Users.hasMany(Connections)

  try {
    const [results, metadata] = await sequelize.query(
      `SELECT username FROM users WHERE id IN(SELECT user_one FROM connections WHERE user_one=${user.id} or user_two=${user.id})`
    )

    return results
  } catch (err) {
    throw err
  }
}

exports.getAllConnections = async () => {
  let connections = await Connections.findAll()
  return connections
}
