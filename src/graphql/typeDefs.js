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
  }
  type Query {
    auth: User!
  }
  type Mutation {
    register(first_name: String! middle_name: String last_name: String! username: String! email: String! password: String! confirmPassword: String! ) : User!
  }
`
