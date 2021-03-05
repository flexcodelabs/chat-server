const { withFilter, AuthenticationError } = require("apollo-server")
const { register, verifyAccount, login, auth } = require("../controllers/users")
const {
  addUserInfo,
  updateUserInfo,
  addDp,
  addCoverImg,
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
} = require("../controllers/follow")

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
  },
  Mutation: {
    register,
    verifyAccount,
    addUserInfo,
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
