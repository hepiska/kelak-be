import articleDa from "dataAccess/article"
import joi from "@hapi/joi"
import { parseSort, stringToQueryObj } from "libs/helpers"


const ArticleSchema = joi.object().keys({
  name: joi.string().required(),
  title: joi.string(),
  primaryImage: joi.number(),
  image: joi.array().items(joi.string()),
  content: joi.string().required()
})

const QSkipLimitSchema = joi.object().keys({
  search: joi.string(),
  skip: joi.number().default(0),
  limit: joi.number().default(10),
  sort: joi.string()
})


const articleControlers = {
  post: async (req, res) => {
    try {
      const articleVal = await joi.validate(req.body, ArticleSchema, { stripUnknown: true })

      await articleDa.create({ ...articleVal, author: req.user._id })


      return res.json({ message: "create article success" })

    } catch (error) {
      throw error
    }

  },
  put: async (req, res) => {
    try {
      const articleVal = await joi.validate(req.body, ArticleSchema, { stripUnknown: true })

      await articleDa.update({ _id: req.params.id }, { ...articleVal, author: req.user._id })

      return res.json({ message: "update article success" })

    } catch (error) {
      throw error
    }

  },
  delete: async (req, res) => {
    await articleDa.delete(req.params.id)

    return res.json({ message: "delete article success" })

  },
  get: async (req, res) => {
    try {
      const article = await articleDa.findOneByID(req.params.id)

      res.json(article)

    } catch (error) {
      throw error
    }

  },
  getAll: async (req, res) => {
    try {
      const { skip, limit, sort, search } = await joi.validate(req.query, QSkipLimitSchema)
      const query = stringToQueryObj(search)
      const sortParsed = parseSort(sort)
      const articles = await articleDa.find(query, { skip: skip, limit, sort: sortParsed })


      return res.json(articles)

    } catch (error) {
      throw error
    }
  }
}


export default articleControlers
