const { AuthenticationError, UserInputError } = require("apollo-server")
const { Op } = require("sequelize")
const { Chats, sequelize, Messages } = require("../../models")

exports.requestChat = async (_, { id }, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let warning = null
  try {
    let chatCheck = await Chats.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ user_one: user.id }, { user_two: id }],
          },
          {
            [Op.and]: [{ user_one: id }, { user_two: user.id }],
          },
        ],
      },
    })

    if (chatCheck) {
      warning = "Chat exists"
    }
    if (warning) {
      throw new UserInputError("BAD_INPUT", { warning })
    } else {
      let chat = await Chats.create({
        user_one: user.id,
        user_two: id,
        status: false,
        active_user: user.id,
      })
      return chat
    }
  } catch (err) {
    throw err
  }
}

exports.acceptChat = async (_, { id }, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let warning = null
  try {
    let chatCheck = await Chats.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ user_one: user.id }, { user_two: id }],
          },
          {
            [Op.and]: [{ user_one: id }, { user_two: user.id }],
          },
        ],
      },
    })

    if (!chatCheck) {
      warning = "Request does not exists"
    } else {
      if (chatCheck.user_one === user.id) {
        warning = "Can't accept your own request"
      }
      if (chatCheck.status === true) {
        warning = "Chat already created"
      }
    }
    if (warning) {
      throw new UserInputError("BAD_INPUT", { warning })
    } else {
      let chat = await Chats.update(
        {
          status: true,
          active_user: user.id,
        },
        {
          where: {
            [Op.and]: [{ user_one: id }, { user_two: user.id }],
          },
        }
      )
      console.log(chat)
      return chat
    }
  } catch (err) {
    throw err
  }
}

exports.rejectChat = async (_, { id }, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let warning = null
  try {
    let chatCheck = await Chats.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ user_one: user.id }, { user_two: id }],
          },
          {
            [Op.and]: [{ user_one: id }, { user_two: user.id }],
          },
        ],
      },
    })

    if (!chatCheck) {
      warning = "Request does not exists"
    } else {
      if (chatCheck.user_one === user.id) {
        warning = "Can't reject your own request"
      }
      if (chat.status === true) {
        warning = "Chat already created"
      }
    }
    if (warning) {
      throw new UserInputError("BAD_INPUT", { warning })
    } else {
      let chat = await Chats.destroy({
        where: {
          [Op.and]: [{ user_one: id }, { user_two: user.id }],
        },
      })
      console.log(chat)
      return chatCheck
    }
  } catch (err) {
    throw err
  }
}

exports.getUserChats = async (_, __, { user }) => {
  if (!user) throw new AuthenticationError("Unauthorized")
  try {
    const [result1, metadata] = await sequelize.query(
      `SELECT * FROM users WHERE id IN(SELECT user_one FROM chats WHERE user_two=${user.id} ORDER BY updatedAt DESC)`
    )
    const [result2, metadata2] = await sequelize.query(
      `SELECT * FROM users WHERE id IN(SELECT user_two FROM chats WHERE user_one=${user.id} and user_two!=${user.id} ORDER BY updatedAt DESC )`
    )
    let messages = await Messages.findAll({
      where: {
        [Op.or]: [{ senderId: user.id }, { recipientId: user.id }],
      },
      order: [["createdAt", "DESC"]],
    })
    let results = result1.concat(result2)

    results = results.map((otherUser) => {
      let latestMessage = messages.find(
        (m) =>
          (m.senderId === otherUser.id && m.recipientId === user.id) ||
          (m.senderId === user.id && m.recipientId === otherUser.id)
      )

      otherUser.latestMessage = latestMessage
      // console.log(latestMessage)
      return otherUser
    })
    // console.log(results[1].latestMessage)
    return results
  } catch (err) {
    throw err
  }
}

exports.getChats = async () => {
  let chats = await Chats.findAll()
  return chats
}

exports.checkChat = async (_, { id }, { user }) => {
  if (!user) throw new AuthenticationError("Unauthorized")
  try {
    let check = await Chats.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ user_one: user.id }, { user_two: id }],
          },
          {
            [Op.and]: [{ user_one: id }, { user_two: user.id }],
          },
        ],
      },
      attributes: ["status", "active_user"],
    })
    // console.log(check)
    if (check) {
      return check
    } else {
      throw new UserInputError("BAD_INPUT")
    }
  } catch (err) {
    throw err
  }
}
