import articleDa from "dataAccess/article"
import joi from "@hapi/joi"
import { parseSort, stringToQueryObj } from "libs/helpers"
import { uploadImage } from "libs/images"
import { articleTypes } from "../../utis/constants"


const ArticleSchema = joi.object().keys({
  name: joi.string().required(),
  title: joi.string(),
  primaryImage: joi.number(),
  images: joi.array().items(joi.string()),
  summary: joi.string(),
  isHeadline: joi.boolean(),
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

      const article = await articleDa.create({ ...articleVal, author: req.user._id })


      return res.json({ message: "create article success", article })

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
  uploadImage: async(req, res) => {
    const result = await uploadImage({
      file: req.body.file,
      fileName: req.body.fileName,
      folder: "kelak/articles"
    })

    res.json(result)
  },
  get: async (req, res) => {
    try {
      const article = await articleDa.findOneByID(req.params.id)

      res.json(article)

    } catch (error) {
      throw error
    }

  },
  getTypes: (req, res) => {
    return res.json({ total: articleTypes.length, articleTypes: articleTypes })
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
