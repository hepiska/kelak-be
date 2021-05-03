import joi from "@hapi/joi"
import userDA from "dataAccess/user"
import { sendTextEmail } from "service/mail"
import { userRoles } from "utis/constants"
import randomstring from "randomstring"
import { parseSort, stringToQueryObj } from "libs/helpers"


const UserSchema = joi.object().keys({
  name: joi.string().required(),
  phone_number: joi.string(),
  email: joi.string().required(),
  password: joi.string(),
  images: joi.string(),
  roles: joi.array().items(joi.string()),
})


const QSkipLimitSchema = joi.object().keys({
  search: joi.string(),
  skip: joi.number().default(0),
  limit: joi.number().default(10),
  sort: joi.string()
})


const userControler = {
  getAll: async (req, res, next) => {
    try {
      const { skip, limit, sort, search } = await joi.validate(req.query, QSkipLimitSchema)
      const query = stringToQueryObj(search)
      const sortParsed = parseSort(sort)

      const usersres = await userDA.find(query, { skip, limit, sort: sortParsed }, { password: 0 })

      return res.json(usersres)

    } catch (error) {
      return next(error)
    }
  },
  get: async (req, res, next) => {
    try {
      const userRes = await userDA.findOne({ _id: req.params.id })

      return res.json(userRes)
    } catch (error) {
      return next(error)
    }

  },
  post: async(req, res, next) => {
    try {
      const userInput = await joi.validate(req.body, UserSchema, { stripUnknown: true })

      if (!userInput.password) {
        userInput.password = randomstring.generate({ length: 5, charset: "alphabetic" })
      }


      await userDA.create({ ...userInput })

      sendTextEmail({ to: userInput.email,
        subject: "kelak password",
        message: `akun kelak anda telah dibuat dengan pasword ${userInput.password}` })

      return res.json({ message: "create user success" })

    } catch (error) {

      return next(error)

    }
  },
  put: async(req, res, next) => {
    try {
      const userInput = await joi.validate(req.body, UserSchema, { stripUnknown: true })


      await userDA.update({ _id: req.params.id }, { ...userInput })


      return res.json({ message: "update user success" })

    } catch (error) {

      return next(error)

    }
  },
  delete: async (req, res, next) => {
    try {
      await userDA.delete(req.params.id)

      return res.json({ message: "delete user success" })

    } catch (error) {
      return next(error)
    }
  },
  getRoles: (req, res, next) => {

    return res.json({ total: userRoles.length, userRoles: userRoles })
  },

}

export default userControler
