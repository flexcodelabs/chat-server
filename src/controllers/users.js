const { UserInputError, AuthenticationError } = require("apollo-server")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { Op } = require("sequelize")

const { Users, Chats } = require("../../models")

exports.register = async (_, args) => {
  let {
    first_name,
    middle_name,
    last_name,
    username,
    email,
    password,
    confirmPassword,
  } = args

  // validate data
  let errors = {}
  let verification_code

  try {
    if (first_name.trim() === "")
      errors.first_name = "This field shouldn't be empty"
    if (last_name.trim() === "")
      errors.last_name = "This field shouldn't be empty"
    if (username.trim() === "")
      errors.username = "This field shouldn't be empty"
    if (password.trim() === "")
      errors.password = "This field must have atleast 6 characters"
    if (confirmPassword.trim() === "")
      errors.confirmPassword = "This field shouldn't be empty"

    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords must match"

    // hashing password
    password = await bcrypt.hash(password, 6)

    if (Object.keys(errors).length > 0) {
      throw errors
    }

    verification_code = Math.floor(100000 + Math.random() * 900000)

    const user = await Users.create({
      first_name,
      middle_name,
      last_name,
      username,
      email,
      password,
      verification_code,
    })

    const token = jwt.sign(
      { id: user.id, verified: user.verified },
      process.env.JWT_SECRET,
      {
        expiresIn: 60 * 60 * 24 * 30 * 365,
      }
    )

    return {
      ...user.toJSON(),
      token,
    }
  } catch (err) {
    console.log(err)
    if (err.name === "SequelizeUniqueConstraintError") {
      err.errors.forEach((e) => (errors[e.path] = `${e.path} is already taken`))
    } else if (err.name === "SequelizeValidationError") {
      err.errors.forEach((e) => (errors[e.path] = e.message))
    }
    throw new UserInputError("Bad Input", { errors })
  }
}

exports.login = async (_, args) => {
  let { email_username, password } = args
  let errors = {}
  try {
    let user = await Users.findOne({
      where: {
        [Op.or]: [{ email: email_username }, { username: email_username }],
      },
    })

    if (!user) {
      errors.email_username = "Invalid Username or Email"
    }

    const correctPassword = await bcrypt.compare(password, user.password)

    if (!correctPassword) errors.password = "Invalid credentials"

    if (Object.keys(errors).length > 0) {
      throw new UserInputError("Bad input", { errors })
    } else {
      const token = jwt.sign(
        { id: user.id, verified: user.verified },
        process.env.JWT_SECRET,
        {
          expiresIn: 60 * 60 * 24 * 30 * 365,
        }
      )

      return {
        ...user.toJSON(),
        token,
      }
    }
  } catch (err) {
    console.log(err)
    throw new UserInputError("Bad Input", { errors })
  }
}

exports.verifyAccount = async (_, { code }, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  let error = null
  try {
    let fetchCode = await Users.findOne({
      where: {
        id: user.id,
      },
    })

    if (code !== fetchCode.verification_code) {
      error = "Code does not match the code we sent please enter the valid code"
    }

    if (error === null) {
      let userVerified = await Users.update(
        { verified: true },
        {
          where: {
            id: user.id,
          },
        },
        { raw: true }
      )

      let chat = await Chats.create({
        user_one: user.id,
        user_two: user.id,
        status: true,
        active_user: user.id,
      })

      let userData = await Users.findOne({
        where: {
          id: user.id,
        },
      })

      const token = jwt.sign(
        { id: userData.id, verified: userData.verified },
        process.env.JWT_SECRET,
        {
          expiresIn: 60 * 60 * 24 * 30 * 365,
        }
      )

      return {
        userVerified,
        chat,
        ...userData.toJSON(),
        token,
      }
    } else {
      throw error
    }
  } catch (err) {
    console.log(err)
    throw new UserInputError("Bad Input", { error })
  }
}

exports.auth = async (_, __, { user }) => {
  if (!user) throw new AuthenticationError("Unauthenticated")
  try {
    let userData = await Users.findOne({
      where: {
        id: user.id,
      },
    })

    return userData
  } catch (err) {
    throw err
  }
}

exports.getUsers = async () => {
  let users = await Users.findAll()
  return users
}
