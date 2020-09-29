import adsDa from "dataAccess/ads"
import joi from "@hapi/joi"
import { parseSort, stringToQueryObj } from "libs/helpers"
import { uploadImage } from "libs/images"
import { adsTypes } from "../utis/constants"
import { adsLimit } from "../utis/config"


const AdsSchema = joi.object().keys({
  name: joi.string().required(),
  title: joi.string().required(),
  primaryImage: joi.number(),
  images: joi.array().items(joi.string()),
  start_at: joi.date().required(),
  end_at: joi.date().required(),
  summary: joi.string(),
  refrence_url: joi.string(),
  type: joi.string(),
  articles_show: joi.array().items(joi.string()),
  collection_show: joi.array().items(joi.string()),
  content: joi.string()
})


const QSkipLimitSchema = joi.object().keys({
  search: joi.string(),
  skip: joi.number().default(0),
  limit: joi.number().default(10),
  status: joi.string(),
  sort: joi.string()
})


const articleControlers = {
  getAll: async (req, res, next) => {
    try {
      const { skip, limit, sort, search, status } = await joi.validate(req.query, QSkipLimitSchema)
      const query = stringToQueryObj(search)
      const now = new Date()

      if (status === "active") {
        query.start_at = { $lte: now }
        query.end_at = { $gte: now }
      }
      if (status === "incoming") {
        query.start_at = { $gte: now }
      }
      if (status === "past") {
        query.end_at = { $lte: now }
      }
      const sortParsed = parseSort(sort)
      const ads = await adsDa.find(query, { skip: skip, limit, sort: sortParsed })


      return res.json(ads)

    } catch (error) {
      return next(error)
    }
  },
  post: async (req, res, next) => {
    try {
      const adsVal = await joi.validate(req.body, AdsSchema, { stripUnknown: true })
      const arcQuery = { type: adsVal.type,
        start_at: { $gte: adsVal.start_at, $lte: adsVal.end_at },
        end_at: { $lte: adsVal.end_at, $gte: adsVal.start_at } }

      if (adsVal.articles_show && adsVal.articles_show.length) {
        arcQuery.articles_show = { $in: adsVal.articles_show }
      }
      if (adsVal.collection_show && adsVal.collection_show.length) {
        arcQuery.articles_show = { $in: adsVal.collection_show }
      }
      const adscount = await adsDa.find(arcQuery, { skip: 0, limit: 1 })

      if (adscount.total >= adsLimit[adsVal.type]) {

        throw new Error("jumlah iklan melibihi batas")
      }


      const ads = await adsDa.create({ ...adsVal, author: req.user._id })


      return res.json({ message: "create article success", ads })

    } catch (error) {
      return next(error)
    }

  },
  put: async (req, res, next) => {
    try {
      const adsVal = await joi.validate(req.body, AdsSchema, { stripUnknown: true })

      await adsDa.update({ _id: req.params.id }, { ...adsVal, author: req.user._id })

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
