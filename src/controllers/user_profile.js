const { AuthenticationError } = require("apollo-server")
const { Users } = require("../../models")

exports.updateUserInfo = async (_, args, { user }) => {
  let { about, bio, DOB, location, gender, title } = args
  if (!user) throw new AuthenticationError("Unauthenticated")
  try {
    let add_details = await Users.update(
      {
        about,
        bio,
        DOB,
        location,
        gender,
        title,
      },
      {
        where: {
          id: user.id,
        },
      }
    )
    console.log(add_details)
    let added_data = await Users.findOne({ where: { id: user.id } })
    return added_data
  } catch (err) {
    throw err
  }
}

exports.addDp = async (_, args, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let {} = args
}

exports.addCoverImg = async (_, args, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let {} = args
}
