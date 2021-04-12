const { ApolloServer } = require("apollo-server")
const dotenv = require("dotenv")
const resolvers = require("./src/graphql/resolvers")
const typeDefs = require("./src/graphql/typeDefs")
const contextMiddleware = require("./src/utils/contextMiddleware")
const { sequelize } = require("./models")

dotenv.config()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
  subscriptions: { path: "/graphql" },
})

server
  .listen()
  .then(({ url, subscriptionsUrl }) => {
    console.log(`Subscriptions ready at ${subscriptionsUrl}`)
    sequelize
      .authenticate()
      .then(() => {
        console.log("database connected...!!")
      })
      .catch((err) => console.log(err))
  })
  .catch((err) => {
    console.log(err)
  })
