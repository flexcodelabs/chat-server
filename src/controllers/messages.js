const { AuthenticationError, UserInputError } = require("apollo-server")
const { Op } = require("sequelize")
const { Chats, sequelize, Messages, Reactions, Users } = require("../../models")

exports.sendMessage = async (
  _,
  { username, chatId, content, media, media_type, links, parentId },
  { user, pubsub }
) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let error = null
  let parentMsg = null
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
    let sender = await Users.findOne({
      where: {
        id: user.id,
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
    if (parentId) {
      parentMsg = await Messages.findOne({
        where: {
          id: parentId,
        },
      })
    }
    if (chatCheck) {
      let msg = await Messages.create({
        senderId: user.id,
        recipientId: anotherUser.id,
        chatId: chatCheck.id,
        content,
        parentId,
      })
      msg.recipient = anotherUser
      msg.sender = sender
      msg.parentMsg = parentMsg
      pubsub.publish("NEW_MESSAGE", {
        newMessage: msg,
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
          parentId,
        })
        msg.recipient = anotherUser
        msg.sender = sender
        msg.parentMsg = parentMsg
        pubsub.publish("NEW_MESSAGE", {
          newMessage: msg,
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
      })
    }
    messages = messages.map((message) => {
      let parentMsg = messages.find((m) => m.id == message.parentId)
      if (parentMsg) message.parentMsg = parentMsg
      return message
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
