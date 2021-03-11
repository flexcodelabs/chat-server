const { withFilter, AuthenticationError } = require("apollo-server")
const {
  register,
  verifyAccount,
  login,
  auth,
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
          console.log(newConnection)
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
  },
}
