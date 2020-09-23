import adsDa from "dataAccess/ads"
import joi from "@hapi/joi"
import { parseSort, stringToQueryObj } from "libs/helpers"
import { uploadImage } from "libs/images"
import { adsTypes } from "../utis/constants"


const ArticleSchema = joi.object().keys({
  name: joi.string().required(),
  title: joi.string().required(),
  primaryImage: joi.number(),
  images: joi.array().items(joi.string()),
  start_at: joi.date().required(),
  end_at: joi.date().required(),
  summary: joi.string(),
  type: joi.string(),
  content: joi.string()
})


const QSkipLimitSchema = joi.object().keys({
  search: joi.string(),
  skip: joi.number().default(0),
  limit: joi.number().default(10),
  sort: joi.string()
})


const articleControlers = {
  getAll: async (req, res, next) => {
    try {
      const { skip, limit, sort, search } = await joi.validate(req.query, QSkipLimitSchema)
      const query = stringToQueryObj(search)
      const sortParsed = parseSort(sort)
      const articles = await adsDa.find(query, { skip: skip, limit, sort: sortParsed })


      return res.json(articles)

    } catch (error) {
      return next(error)
    }
  },
  post: async (req, res, next) => {
    try {
      const articleVal = await joi.validate(req.body, ArticleSchema, { stripUnknown: true })

      const article = await adsDa.create({ ...articleVal, author: req.user._id })


      return res.json({ message: "create article success", article })

    } catch (error) {
      return next(error)
    }

  },
  put: async (req, res, next) => {
    try {
      const articleVal = await joi.validate(req.body, ArticleSchema, { stripUnknown: true })

      await adsDa.update({ _id: req.params.id }, { ...articleVal, author: req.user._id })

      return res.json({ message: "update article success" })

    } catch (error) {
      return next(error)
    }

  },
  delete: async (req, res, next) => {
    await adsDa.delete(req.params.id)

    return res.json({ message: "delete article success" })
  },
  uploadImage: async(req, res, next) => {
    const result = await uploadImage({
      file: req.body.file,
      fileName: req.body.fileName,
      folder: "kelak/ads"
    })

    res.json(result)
  },
  get: async (req, res, next) => {
    try {
      const article = await adsDa.findOneByID(req.params.id)

      return res.json(article)

    } catch (error) {
      return next(error)
    }

  },
  getTypes: (req, res, next) => {

    return res.json({ total: adsTypes.length, adsTypes: adsTypes })
  },
}


export default articleControlers
