const { AuthenticationError, UserInputError } = require("apollo-server")
const { Op } = require("sequelize")
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

exports.updateLastSeen = async (_, { now }, { user, pubsub }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  try {
    let update = await Users.update(
      {
        last_seen: now,
      },
      {
        where: {
          id: user.id,
        },
      }
    )

    console.log(update)

    let userData = await Users.findOne({
      where: {
        id: user.id,
      },
    })

    pubsub.publish("LAST_SEEN", {
      userLastSeen: userData,
    })

    return userData
  } catch (err) {
    throw err
  }
}

exports.getOnlineUsers = async (_, __, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  try {
    let time = new Date().getTime()
    let users = []
    users = await Users.findAll({
      where: {
        last_seen: {
          [Op.gte]: time - 30000,
        },
      },
      order: [["last_seen", "DESC"]],
    })
    return users
  } catch (err) {
    throw err
  }
}

exports.addDp = async (_, { file }, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  console.log(file)
  try {
    return file.then((file) => {
      const { createReadStream, filename, mimetype } = file
      const fileStream = createReadStream()
      fileStream.pipe(fs.createWriteStream(`./files/${filename}`))
      return file
    })
  } catch (err) {
    console.log(err)
    throw err
  }
}

exports.addCoverImg = async (_, args, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let {} = args
}

exports.getUser = async (_, { id }) => {
  let msg = null
  try {
    let user = await Users.findOne({
      where: {
        id,
      },
    })
    if (!user) {
      msg = "User Not found"
      throw new UserInputError("NOT FOUND", { msg })
    } else {
      return user
    }
  } catch (err) {
    throw err
  }
}
