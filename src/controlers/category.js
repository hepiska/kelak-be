import categoryDa from "dataAccess/category"
import joi from "@hapi/joi"
import { parseSort, stringToQueryObj } from "libs/helpers"


const CategorySchema = joi.object().keys({
  name: joi.string().required(),
  desc: joi.string(),
  images: joi.array().items(joi.string()),
})


const QSkipLimitSchema = joi.object().keys({
  search: joi.string(),
  skip: joi.number().default(0),
  limit: joi.number().default(10),
  sort: joi.string()
})


const CategoryController = {
  post: async (req, res) => {
    try {
      const articleVal = await joi.validate(req.body, CategorySchema, { stripUnknown: true })

      const category = await categoryDa.create({ ...articleVal, author: req.user._id })


      return res.json({ message: "create category success", category })

    } catch (error) {
      throw error
    }

  },
  put: async (req, res) => {
    try {
      const articleVal = await joi.validate(req.body, CategorySchema, { stripUnknown: true })

      await categoryDa.update({ _id: req.params.id }, { ...articleVal, author: req.user._id })

      return res.json({ message: "update article success" })

    } catch (error) {
      throw error
    }

  },
  delete: async (req, res) => {
    await categoryDa.delete(req.params.id)

    return res.json({ message: "delete article success" })
  },

  get: async (req, res) => {
    try {
      const article = await categoryDa.findOneByID(req.params.id)

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
      const articles = await categoryDa.find(query, { skip: skip, limit, sort: sortParsed })


      return res.json(articles)

    } catch (error) {
      throw error
    }
  }
}


export default CategoryController
