import articleDa from "dataAccess/article"
import categoryModel from "models/category"

import joi from "@hapi/joi"
import { parseSort, stringToQueryObj } from "libs/helpers"
import { uploadImage } from "libs/images"
import { articleTypes } from "../utis/constants"


const ArticleSchema = joi.object().keys({
  name: joi.string().required(),
  title: joi.string(),
  primaryImage: joi.number(),
  categories: joi.array().items(joi.string()),
  images: joi.array().items(joi.string()),
  type: joi.string().required(),
  summary: joi.string(),
  video_uri: joi.string(),
  source_name: joi.string(),
  podcast_uri: joi.string(),
  source_uri: joi.string(),
  isHeadline: joi.boolean(),
  content: joi.string().required()
})


const QSkipLimitSchema = joi.object().keys({
  search: joi.string(),
  category: joi.string(),
  skip: joi.number().default(0),
  limit: joi.number().default(10),
  sort: joi.string()
})


const articleControlers = {
  post: async (req, res, next) => {
    try {
      const articleVal = await joi.validate(req.body, ArticleSchema, { stripUnknown: true })

      const article = await articleDa.create({ ...articleVal, author: req.user._id })


      return res.json({ message: "create article success", article })

    } catch (error) {
      return next(error)
    }

  },
  put: async (req, res, next) => {
    try {
      const articleVal = await joi.validate(req.body, ArticleSchema, { stripUnknown: true })

      await articleDa.update({ _id: req.params.id }, { ...articleVal, author: req.user._id })

      return res.json({ message: "update article success" })

    } catch (error) {
      return next(error)
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
  get: async (req, res, next) => {
    try {
      const article = await articleDa.findOneByID(req.params.id)

      return res.json(article)

    } catch (error) {
      return next(error)

    }

  },
  getbySlug: async (req, res, next) => {
    try {
      const article = await articleDa.findOne({ slug: req.params.slug })

      return res.json(article)

    } catch (error) {
      return next(error)

    }

  },
  getTypes: (req, res) => {

    // return res.json({ message: "sasas" })
    return res.json({ total: articleTypes.length, articleTypes: articleTypes })
  },
  getAll: async (req, res, next) => {
    try {
      const { skip, limit, sort, search, category } = await joi.validate(req.query, QSkipLimitSchema)
      const query = stringToQueryObj(search)


      if (category) {
        const cat = await categoryModel.findOne({ slug: category })

        query.categories = cat._id
      }

      const sortParsed = parseSort(sort)

      const articles = await articleDa.find(query, { skip: skip, limit, sort: sortParsed })


      return res.json(articles)

    } catch (error) {
      return next(error)
    }
  }
}


export default articleControlers
