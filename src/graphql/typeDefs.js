const { gql } = require("apollo-server")

// The GraphQL schema
module.exports = gql`
  type User {
    first_name: String!
    middle_name: String
    last_name: String!
    email: String!
    username: String!
    status: String
    account_status: String!
    type: String!
    deleted_status: Boolean!
    verified: Boolean!
    verification_code: Int!
    confirmed: Boolean!
    id: Int!
    token: String!
    about: String
    bio: String
    DOB: String
    dp: String
    cover_image: String
    createdAt: String
    updatedAt: String
    location: String
  }
  type Connections {
    id: Int!
  }
  type Follow {
    id: Int!
  }
  type Query {
    auth: User!
    login(email_username: String!, password: String!): User!
    getFollowers: [User]
    getFollowings: [User]
    getConnections: [User]
    getUnacceptedRequests: [User]
    getConnectionRequests: [User]
  }
  type Mutation {
    register(
      first_name: String!
      middle_name: String
      last_name: String!
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
      type: String!
    ): User!
    verifyAccount(code: Int!): User!
    addUserInfo(about: String, bio: String, DOB: String, location: String): User
    updateUserInfo(
      about: String
      bio: String
      DOB: String
      location: String
    ): User
    addDp(dp: String): User!
    addCoverImg(cover_image: String): User!
    requestConnection(user_two: Int!): Connections
    acceptConnection(id: Int!): Connections
    rejectConnection(id: Int!): Connections
    follow(id: Int!): Follow
    unfollow(id: Int!): Follow
  }
`
