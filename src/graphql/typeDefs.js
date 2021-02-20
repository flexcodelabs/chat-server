const { ApolloServer, gql } = require("apollo-server")

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
  }
  type Query {
    auth: User!
  }
`
