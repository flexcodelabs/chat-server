const { withFilter, AuthenticationError } = require("apollo-server")
const { Connections } = require("../../models")
const {
  register,
  verifyAccount,
  login,
  auth,
  checkUsername,
  addUsername,
  getUsers,
} = require("../controllers/users")
const {
  sendMessage,
  getMessages,
  deleteMessage,
  getMessagesAll,
} = require("../controllers/messages")
const { react, unreact } = require("../controllers/reactions")
const {
  updateUserInfo,
  addDp,
  addCoverImg,
  getUser,
  updateLastSeen,
  getOnlineUsers,
} = require("../controllers/user_profile")
const {
  requestConnection,
  acceptConnection,
  rejectConnection,
  deleteConnection,
  getConnections,
  getUserConnectionRequests,
  getConnectionRequests,
  getAllConnections,
  getConnectionsCount,
  checkConnection,
  getBlockedUsers,
  blockUser,
  unBlockUser,
} = require("../controllers/connections")
const {
  follow,
  unfollow,
  getFollowers,
  getFollowings,
  getFollowersCount,
  getFollowingsCount,
  checkFollowing,
} = require("../controllers/follow")

const {
  rejectChat,
  acceptChat,
  requestChat,
  getUserChats,
  checkChat,
  getChats,
} = require("../controllers/chat")

const { searchProfile } = require("../controllers/search")

module.exports = {
  Query: {
    auth,
    login,
    getFollowers,
    getFollowings,
    getConnections,
    getUserConnectionRequests,
    getConnectionRequests,
    getConnectionsCount,
    getAllConnections,
    getBlockedUsers,
    getFollowersCount,
    getFollowingsCount,
    searchProfile,
    getUser,
    checkConnection,
    checkFollowing,
    getUserChats,
    getUsers,
    getChats,
    checkChat,
    getMessages,
    getMessagesAll,
    checkUsername,
    getOnlineUsers,
  },
  Mutation: {
    register,
    verifyAccount,
    updateUserInfo,
    addDp,
    addCoverImg,
    requestConnection,
    acceptConnection,
    rejectConnection,
    deleteConnection,
    blockUser,
    unBlockUser,
    follow,
    unfollow,
    rejectChat,
    acceptChat,
    requestChat,
    react,
    unreact,
    sendMessage,
    deleteMessage,
    addUsername,
    updateLastSeen,
  },
  Subscription: {
    newFollower: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) throw new AuthenticationError("Unauthenticated")
          return pubsub.asyncIterator(["NEW_FOLLOWER"])
        },
        ({ newFollower }, _, { user }) => {
          if (newFollower.userId === user.id) {
            return true
          }
          return false
        }
      ),
    },
    newConnectionRequest: {
      subscribe: withFilter(
        (_, __, { user, pubsub }) => {
          if (!user) throw new AuthenticationError("Unauthenticated")
          return pubsub.asyncIterator("NEW_CONNECTION_REQUEST")
        },
        ({ newConnectionRequest }, _, { user }) => {
          if (newConnectionRequest.addressee === user.id) {
            return true
          }
          return false
        }
      ),
    },
    newConnection: {
      subscribe: withFilter(
        (_, __, { user, pubsub }) => {
          if (!user) throw new AuthenticationError("Unauthenticated")
          return pubsub.asyncIterator("NEW_CONNECTION")
        },
        ({ newConnection }, _, { user }) => {
          if (
            (newConnection.userId === user.id ||
              newConnection.connectedTo === user.id) &&
            newConnection.status === "A"
          ) {
            return true
          }
          return false
        }
      ),
    },
    newMessage: {
      subscribe: withFilter(
        (_, __, { user, pubsub }) => {
          if (!user) throw new AuthenticationError("Unauthenticated")
          return pubsub.asyncIterator("NEW_MESSAGE")
        },
        ({ newMessage }, _, { user }) => {
          console.log(newMessage)
          let { senderId, recipientId } = newMessage
          let { id } = user
          if (id === senderId || id === recipientId) {
            console.log(senderId, recipientId)
            return true
          }
          return false
        }
      ),
    },
    userLastSeen: {
      subscribe: withFilter(
        (_, __, { user, pubsub }) => {
          if (!user) throw new AuthenticationError("Unauthenticated")
          return pubsub.asyncIterator("LAST_SEEN")
        },
        ({ userLastSeen }, _, { user }) => {
          return true
        }
      ),
    },
  },
}
