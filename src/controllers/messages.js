const { AuthenticationError, UserInputError } = require("apollo-server")
const { Op } = require("sequelize")
const { Chats, sequelize, Messages, Reactions } = require("../../models")

exports.sendMessage = async (
  _,
  { id, chatId, content, media, media_type, links },
  { user }
) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let error = null
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
    if (content.trim() === "") {
      error = "Content empty"
      throw new UserInputError("BAD_INPUT", { error })
    }
    if (chatCheck) {
      let msg = await Messages.create({
        senderId: user.id,
        recipientId: id,
        chatId: chatCheck.id,
        content,
      })
      return msg
    } else {
      let chat = await Chats.create({
        user_one: user.id,
        user_two: id,
        status: false,
        active_user: user.id,
      })
      if (chat) {
        let msg = await Messages.create({
          senderId: user.id,
          recipientId: id,
          chatId: chat.id,
          content,
        })
        return msg
      }
      throw new UserInputError("BAD_INPUT")
    }
  } catch (err) {
    throw err
  }
}

exports.getMessages = async (_, { id }, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  try {
    let messages = await Messages.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ senderId: user.id }, { recipientId: id }],
          },
          {
            [Op.and]: [{ senderId: id }, { recipientId: user.id }],
          },
        ],
      },
      order: [["createdAt", "ASC"]],
      include: [{ model: Reactions, as: "reactions" }],
    })
    return messages
  } catch (err) {
    throw err
  }
}

exports.deleteMessage = async (_, { id }, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  try {
  } catch (err) {}
}

exports.getMessagesAll = async () => {
  let msgs = await Messages.findAll()
  return msgs
}
