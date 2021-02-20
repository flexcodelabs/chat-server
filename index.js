const { ApolloServer } = require("apollo-server")
const resolvers = require("./src/graphql/resolvers")
const typeDefs = require("./src/graphql/typeDefs")
const { sequelize } = require("./models")

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
  sequelize
    .authenticate()
    .then(() => {
      console.log("database connected...!!")
    })
    .catch((err) => console.log(err))
})
