const { gql } = require("apollo-server")

// The GraphQL schema
module.exports = gql`
  scalar Date
  type User {
    first_name: String!
    middle_name: String
    last_name: String!
    email: String!
    username: String!
    status: String
    account_status: String!
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
    gender: String
    title: String
    latestMessage: Message
  }
  type ConnectionRequest {
    id: Int
    addressee: Int!
    requester: Int!
  }
  type Connection {
    id: Int
    userId: Int!
    connectedTo: Int!
    status: String!
    active_user_id: Int!
  }
  type Follow {
    id: Int!
    user: Int!
    follows: Int!
  }

  type ConnectionCheck {
    status: String
    value: Boolean!
  }

  type Chat {
    id: Int!
    user_one: Int!
    user_two: Int
    status: Boolean!
    active_user: Int!
  }

  type Message {
    id: Int!
    senderId: Int!
    recipientId: Int!
    chatId: Int!
    content: String!
    media: String
    media_type: String
    links: [String]
    read_status: Boolean!
    received_status: Boolean!
    delete_status: Boolean!
    createdAt: Date!
    reactions: [Reaction]
  }

  type Reaction {
    id: Int!
    messageId: Int!
    userId: Int!
    reaction: String!
  }

  type Query {
    auth: User!
    login(email_username: String!, password: String!): User!
    getFollowers(id: Int!): [User!]
    getFollowings(id: Int!): [User!]
    getConnections(id: Int!): [User]
    getUnacceptedRequests: [User]
    getConnectionRequests: [User]
    getAllConnections: [ConnectionRequest]
    getUserConnectionRequests: [User]
    getConnectionsCount(id: Int!): String
    checkFollowing(id: Int!): Boolean!
    checkConnection(id: Int!): ConnectionCheck
    getBlockedUsers: [User]
    getUsers: [User!]
    getFollowersCount(id: Int!): String
    getFollowingsCount(id: Int!): String
    searchProfile(keyword: String!): [User!]
    getUser(id: Int!): User
    getUserChats: [User]
    getChats: [Chat]
    checkChat(id: Int!): Chat
    getMessages(id: Int!): [Message]
    getMessagesAll: [Message]
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
    ): User!
    verifyAccount(code: Int!): User!
    updateUserInfo(
      about: String
      bio: String
      DOB: String
      location: String
      gender: String
      title: String
    ): User
    addDp(dp: String): User!
    addCoverImg(cover_image: String): User!
    requestConnection(addressee: Int!): Connection
    acceptConnection(requester: Int!): Connection
    rejectConnection(requester: Int!): ConnectionRequest!
    deleteConnection(id: Int!): Connection
    blockUser(userId: Int!): Connection
    unBlockUser(userId: Int!): Connection
    follow(id: Int!): Follow
    unfollow(id: Int!): Follow
    requestChat(id: Int!): Chat
    acceptChat(id: Int!): Chat
    rejectChat(id: Int!): Chat
    sendMessage(
      id: Int!
      chatId: Int
      content: String!
      media: String
      media_type: String
      links: [String]
    ): Message
    deleteMessage(id: Int!): Message
    react(id: Int!): Reaction
    unreact(id: Int!): Reaction
  }
  type Subscription {
    newFollower: User
    newConnectionRequest: User
    newConnection: User
  }
`
