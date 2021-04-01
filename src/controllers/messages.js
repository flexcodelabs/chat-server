const { AuthenticationError, UserInputError } = require("apollo-server")
const { Op } = require("sequelize")
const { Chats, sequelize, Messages, Reactions, Users } = require("../../models")

exports.sendMessage = async (
  _,
  { username, chatId, content, media, media_type, links },
  { user }
) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let error = null
  try {
    if (content.trim() === "") {
      error = "Content empty"
      throw new UserInputError("BAD_INPUT", { error })
    }
    let anotherUser = await Users.findOne({
      where: {
        username,
      },
    })
    let chatCheck
    if (anotherUser) {
      chatCheck = await Chats.findOne({
        where: {
          [Op.or]: [
            {
              [Op.and]: [{ user_one: user.id }, { user_two: anotherUser.id }],
            },
            {
              [Op.and]: [{ user_one: anotherUser.id }, { user_two: user.id }],
            },
          ],
        },
      })
    }

    if (chatCheck) {
      let msg = await Messages.create({
        senderId: user.id,
        recipientId: anotherUser.id,
        chatId: chatCheck.id,
        content,
      })
      return msg
    } else {
      let chat = await Chats.create({
        user_one: user.id,
        user_two: anotherUser.id,
        status: false,
        active_user: user.id,
      })
      if (chat) {
        let msg = await Messages.create({
          senderId: user.id,
          recipientId: anotherUser.id,
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

exports.getMessages = async (_, { username }, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  try {
    let anotherUser = await Users.findOne({
      where: {
        username,
      },
    })
    let messages
    if (anotherUser) {
      messages = await Messages.findAll({
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                { senderId: user.id },
                { recipientId: anotherUser.id },
              ],
            },
            {
              [Op.and]: [
                { senderId: anotherUser.id },
                { recipientId: user.id },
              ],
            },
          ],
        },
        order: [["createdAt", "DESC"]],
        include: [{ model: Reactions, as: "reactions" }],
      })
    }

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
