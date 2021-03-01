const { AuthenticationError } = require("apollo-server")
const { User_Info } = require("../../models")

exports.addUserInfo = async (_, args, { user }) => {
  let { about, bio, DOB, location } = args
  if (!user) throw new AuthenticationError("Unauthenticated")
  try {
    let add_details = await User_Info.create({
      userId: user.id,
      about,
      bio,
      DOB,
      location,
    })

    console.log(add_details)
    return add_details
  } catch (err) {
    throw err
  }
}
exports.updateUserInfo = async (_, args, { user }) => {
  let { about, bio, DOB, location } = args
  if (!user) throw new AuthenticationError("Unauthenticated")
  try {
    let add_details = await User_Info.update(
      {
        userId: user.id,
        about,
        bio,
        DOB,
        location,
      },
      {
        where: {
          userId: user.id,
        },
      }
    )
    console.log(add_details)
    let added_data = await User_Info.findOne({ where: { userId: user.id } })
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
