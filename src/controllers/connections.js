const {
  ConnectionsRequests,
  Users,
  Connections,
  Follow,
} = require("../../models")
const { Op } = require("sequelize")
const { UserInputError, AuthenticationError } = require("apollo-server")
const { sequelize } = require("../../models")

exports.requestConnection = async (_, { addressee }, { user, pubsub }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let warning = {}
  try {
    //   check if user_two is not uauthenticated user
    if (addressee === user.id) {
      warning.msg = "Cant request a connection with yourself"
      throw new UserInputError("Bad Input", { warning })
    }

    // check if second user exists
    let secondUser = await Users.findOne({
      where: {
        id: addressee,
      },
      attributes: ["id"],
    })

    // check if a connection exists
    let check = await Connections.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ userId: user.id }, { connectedTo: addressee }],
          },
          {
            [Op.and]: [{ userId: addressee }, { connectedTo: user.id }],
          },
        ],
      },
      attributes: ["id", "userId", "connectedTo", "status"],
    })

    let checkRequest = await ConnectionsRequests.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ requester: user.id }, { addressee: addressee }],
          },
          {
            [Op.and]: [{ requester: addressee }, { addressee: user.id }],
          },
        ],
      },
      attributes: ["id", "requester", "addressee"],
    })

    if (!secondUser) {
      warning.msg = "This user doesn't exists"
    }
    if (check && (check.status === "B" || (check && check.status === "P"))) {
      warning.msg = "Can't connect to this user"
    }
    if (check && check.status === "A") {
      warning.msg = "You are already connected"
    }
    if (checkRequest && checkRequest.requester === user.id) {
      warning.msg = "You already sent a request to this user"
    }
    if (checkRequest && checkRequest.addressee === user.id) {
      warning.msg = "This user already requested to connect"
    }

    if (Object.keys(warning).length > 0) {
      throw new UserInputError("Bad Input", { warning })
    } else {
      let connect = await ConnectionsRequests.create({
        requester: user.id,
        addressee,
      })
      let userData
      if (connect) {
        userData = await Users.findOne({
          where: {
            id: user.id,
          },
        })
      }
      pubsub.publish("NEW_CONNECTION_REQUEST", {
        newConnectionRequest: {
          ...userData.toJSON(),
          addressee: connect.addressee,
        },
      })
      return connect
    }
  } catch (err) {
    throw new UserInputError("Bad Input", { warning })
  }
}

exports.acceptConnection = async (_, { requester }, { user, pubsub }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let warning = {}
  try {
    //   checks for the existing connection
    let connectionRequest = await ConnectionsRequests.findOne({
      where: {
        [Op.and]: [{ requester }, { addressee: user.id }],
      },
    })
    let connectionCheck = await Connections.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ userId: user.id }, { connectedTo: requester }],
          },
          {
            [Op.and]: [{ userId: requester }, { connectedTo: user.id }],
          },
        ],
      },
      attributes: ["id", "userId", "connectedTo", "status"],
    })

    if (!connectionRequest) warning.msg = "Request doesn't exists"
    if (connectionRequest && connectionRequest.requester === user.id)
      warning.msg = "You cant accept your own request"
    if (connectionCheck && connectionCheck.status === "B")
      warning.msg = "You can't connect to this user"
    if (connectionCheck && connectionCheck.status === "A")
      warning.msg = "You already connected"
    if (connectionRequest && connectionRequest.addressee !== user.id)
      warning.msg = "Can't connect"
    if (Object.keys(warning).length > 0) {
      throw new UserInputError("Bad Input", { warning })
    } else {
      let accept = await Connections.create({
        userId: user.id,
        connectedTo: connectionRequest.requester,
        status: "A",
        active_user_id: user.id,
      })
      let accept_two = await Connections.create({
        userId: connectionRequest.requester,
        connectedTo: user.id,
        status: "A",
        active_user_id: user.id,
      })
      let deleteRequest = await ConnectionsRequests.destroy({
        where: {
          requester,
          addressee: user.id,
        },
      })
      let userData

      if (accept && accept_two) {
        userData = await Users.findOne({
          where: {
            id: user.id,
          },
        })
      }
      pubsub.publish("NEW_CONNECTION", {
        newConnection: {
          ...userData.toJSON(),
          userId: accept.userId,
          connectedTo: accept.connectedTo,
          status: "A",
        },
      })
      return {
        ...accept.toJSON(),
        deleteRequest,
      }
    }
  } catch (err) {
    throw err
  }
}

exports.rejectConnection = async (_, { requester }, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let warning = {}
  try {
    //   checks for the existing connection
    let connectionRequest = await ConnectionsRequests.findOne({
      where: {
        requester,
        addressee: user.id,
      },
    })
    let connectionCheck = await Connections.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ userId: user.id }, { connectedTo: requester }],
          },
          {
            [Op.and]: [{ userId: requester }, { connectedTo: user.id }],
          },
        ],
      },
      attributes: ["id", "userId", "connectedTo", "status"],
    })
    if (!connectionRequest) warning.msg = "Request doesn't exists"
    if (connectionRequest && connectionRequest.requester === user.id)
      warning.msg = "You cant reject your own request"
    if (connectionCheck && connectionCheck.status === "B")
      warning.msg = "No request from this user"
    if (connectionCheck && connectionCheck.status === "A")
      warning.msg = "You already connected"
    if (connectionRequest && connectionRequest.requester === user.id) {
      let deleteRequest = await ConnectionsRequests.destroy({
        where: {
          requester,
        },
      })
      return { deleteRequest, ...connectionRequest }
    }

    if (Object.keys(warning).length > 0) {
      throw new UserInputError("Bad Input", { warning })
    } else {
      let deleteRequest = await ConnectionsRequests.destroy({
        where: {
          requester,
        },
      })
      return { deleteRequest, ...connectionRequest }
    }
  } catch (err) {
    throw err
  }
}

exports.deleteConnection = async (_, { id }, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let warning = {}
  try {
    let connectionCheck = await Connections.findAll({
      where: {
        [Op.or]: [{ userId: id }, { connectedTo: id }],
      },
      attributes: ["id", "userId", "connectedTo", "status"],
    })

    if (connectionCheck.length === 0)
      warning.msg = "This connection doesn't exist"

    if (
      connectionCheck &&
      connectionCheck[0] &&
      !(
        connectionCheck[0].userId !== user.id ||
        connectionCheck[0].connectedTo !== user.id
      )
    )
      warning.msg = "Unathorized"
    console.log(connectionCheck)

    if (Object.keys(warning).length > 0) {
      throw new UserInputError("Bad Input", { warning })
    } else {
      let connectDestroy = await Connections.destroy({
        where: {
          id: [connectionCheck[0].id, connectionCheck[1].id],
        },
      })
      return { ...connectionCheck[0].toJSON(), connectDestroy }
    }
  } catch (err) {
    throw err
  }
}

exports.blockUser = async (_, { userId }, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let warning = {}
  try {
    let userCheck = await Users.findOne({
      where: { id: userId },
    })
    let connectionCheck = await Connections.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ userId: user.id }, { connectedTo: userId }],
          },
          {
            [Op.and]: [{ userId: userId }, { connectedTo: user.id }],
          },
        ],
      },
      attributes: ["id", "userId", "connectedTo", "status"],
    })

    if (!userCheck) warning.msg = "User doesn't exist"

    if (userId === user.id) warning.msg = "Can't block yourself"
    if (
      connectionCheck &&
      connectionCheck[0] &&
      connectionCheck[0].status === "B" &&
      connectionCheck[0].active_user_id !== user.id
    )
      warning.msg = "Couldn't complete this request"
    if (
      connectionCheck &&
      connectionCheck[0] &&
      connectionCheck[0].status === "B" &&
      connectionCheck[0].active_user_id === user.id
    )
      warning.msg = "You already blocked this user"
    if (Object.keys(warning).length > 0) {
      throw new UserInputError("Bad Input", { warning })
    } else {
      if (connectionCheck.length === 0) {
        let block = await Connections.create({
          userId: user.id,
          connectedTo: userId,
          status: "B",
          active_user_id: user.id,
        })
        let requestDestroy = await ConnectionsRequests.destroy({
          where: {
            [Op.or]: [
              {
                [Op.and]: [{ requester: user.id }, { addressee: userId }],
              },
              {
                [Op.and]: [{ requester: userId }, { addressee: user.id }],
              },
            ],
          },
        })
        let followDestroy = await Follow.destroy({
          where: {
            [Op.or]: [
              {
                [Op.and]: [{ user: user.id }, { follows: userId }],
              },
              {
                [Op.and]: [{ user: userId }, { follows: user.id }],
              },
            ],
          },
        })
        return { ...block.toJSON(), requestDestroy, followDestroy }
      } else {
        let block = await Connections.update(
          {
            status: "B",
            active_user_id: user.id,
          },
          {
            where: {
              [Op.or]: [
                {
                  [Op.and]: [{ userId: user.id }, { connectedTo: userId }],
                },
                {
                  [Op.and]: [{ userId: userId }, { connectedTo: user.id }],
                },
              ],
            },
          }
        )

        return { ...connectionCheck[0], block }
      }
    }
  } catch (err) {
    throw err
  }
}

exports.unBlockUser = async (_, { userId }, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let warning = {}
  try {
    let userCheck = await Users.findOne({
      where: { id: userId },
    })
    let connectionCheck = await Connections.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ userId: user.id }, { connectedTo: userId }],
          },
          {
            [Op.and]: [{ userId: userId }, { connectedTo: user.id }],
          },
        ],
      },
      attributes: ["id", "userId", "connectedTo", "status"],
    })

    if (!userCheck) warning.msg = "User doesn't exist"

    if (userId === user.id) warning.msg = "Can't unblock/block yourself"
    if (
      connectionCheck &&
      connectionCheck[0] &&
      connectionCheck[0].status === "B" &&
      connectionCheck[0].active_user_id === user.id
    )
      warning.msg = "Couldn't complete this request"
    if (
      connectionCheck &&
      connectionCheck[0] &&
      connectionCheck[0].status !== "B"
    )
      warning.msg = "This user is not in your blacklist"
    if (connectionCheck.length === 0)
      warning.msg = "Couldn't complete this request"
    if (Object.keys(warning).length > 0) {
      throw new UserInputError("Bad Input", { warning })
    } else {
      let unblock = await Connections.destroy({
        where: {
          [Op.or]: [
            {
              [Op.and]: [{ userId: user.id }, { connectedTo: userId }],
            },
            {
              [Op.and]: [{ userId: userId }, { connectedTo: user.id }],
            },
          ],
          status: "B",
        },
      })

      return { ...connectionCheck[0], unblock }
    }
  } catch (err) {
    throw err
  }
}

exports.getConnectionRequests = async (_, __, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  try {
    const [results, metadata] = await sequelize.query(
      `SELECT username, first_name, last_name FROM users WHERE id IN(SELECT requester FROM connections_requests WHERE addressee=${user.id})`
    )

    return results
  } catch (err) {
    throw err
  }
}

exports.getUserConnectionRequests = async (_, __, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  try {
    const [results, metadata] = await sequelize.query(
      `SELECT username, first_name, last_name FROM users WHERE id IN(SELECT addressee FROM connections_requests WHERE requester=${user.id})`
    )

    return results
  } catch (err) {
    throw err
  }
}

exports.getConnections = async (_, __, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")

  try {
    const [results, metadata] = await sequelize.query(
      `SELECT username, first_name, last_name FROM users WHERE id IN(SELECT connectedTo FROM connections WHERE connectedTo=${user.id} and status != "B")`
    )

    return results
  } catch (err) {
    throw err
  }
}

exports.getConnectionsCount = async (_, __, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  try {
    let count = await Connections.count({
      where: {
        userId: user.id,
        status: "A",
      },
    })
    return count
  } catch (err) {
    throw err
  }
}

exports.getBlockedUsers = async (_, __, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")

  try {
    const [results, metadata] = await sequelize.query(
      `SELECT username, first_name, last_name FROM users WHERE id IN(SELECT userId FROM connections WHERE userId=${user.id} and status='B' and active_user_id = ${user.id})`
    )

    return results
  } catch (err) {
    throw err
  }
}

exports.getAllConnections = async () => {
  let connects = await ConnectionsRequests.findAll()
  return connects
}
