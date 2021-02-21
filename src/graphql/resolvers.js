const { Users } = require("../../models")

module.exports = {
  Query: {
    auth: async () => {
      // querying user data
      let user
      return user
    },
  },
  Mutation: {
    register: async (_, args) => {
      let {
        first_name,
        last_name,
        middle_name,
        username,
        type,
        email,
        password,
        confirmPassword,
      } = args
    },
  },
}
