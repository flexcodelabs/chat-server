const {
  register,
  verifyAccount,
  login,
  auth,
  getUsers,
} = require("../controllers/users")
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
  blockUser,
  unBlockUser,
} = require("../controllers/connections")
const {
  follow,
  unfollow,
  getFollowers,
  getFollowings,
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
    getUsers,
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
}

// set subscription method so I can start working on the client side of the app
