import joi from "@hapi/joi"
import bcrypt from "bcryptjs"
import { signJwt } from "libs/jwt"
import userDa from "dataAccess/user"
// import { user as userDa } from "dataAccess"

const registerSchema = joi.object().keys({
  email: joi.string().email({ minDomainSegments: 2 })
    .required(),
  password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  name: joi.string().min(1)
    .required()
})

const changePasswordSchema = joi.object().keys({
  password: joi.string().required(),
  newPassword: joi.string().required()

})

const loginSchema = joi.object().keys({
  email: joi.string().email({ minDomainSegments: 2 })
    .required(),
  password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
})

const userControler = {
  register: async (req, res, next) => {
    try {
      await joi.validate(req.body, registerSchema)
      const userData = { ...req.body }


      const user = await userDa.create(userData)

      Reflect.deleteProperty(user, "password")
      const token = signJwt(user)

      return res.json({ token })
    } catch (error) {
      return next(error)
    }
  },

  login: async (req, res, next) => {
    try {
      await joi.validate(req.body, loginSchema)
      const loginData = { ...req.body }
      const user = await userDa.findOneByEmail(loginData.email)

      if (!user) {
        throw new Error("email or password un match")
      }
      const isPasswordMatch = bcrypt.compareSync(loginData.password, user.password)

      if (!isPasswordMatch) {

        throw new Error("email or password un match")
      }
      Reflect.deleteProperty(user, "password")
      const token = signJwt(user)

      return res.json({ token })

    } catch (error) {
      return next(error)
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const input = await joi.validate(req.body, changePasswordSchema, { stripUnknown: true })
      const user = await userDa.findOne({ _id: req.params.id })

      if (!user) {
        throw new Error("email or password un match")
      }
      const isPasswordMatch = bcrypt.compareSync(input.password, user.password)

      if (!isPasswordMatch) {
        throw new Error("password un match")
      }

      const newUser = { ...user, password: input.newPassword }

      await userDa.update({ _id: user._id }, newUser)

      return res.json({ message: "update password success" })
    } catch (error) {
      return next(error)
    }

  }

}

export default userControler
