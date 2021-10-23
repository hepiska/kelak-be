import { mongo } from "models"
import { Types } from "mongoose"


const articleDa = {
  create: data => {
    return mongo.article.create(data).then(res => {
      return res ? res.toObject() : null
    })
  },
  update: (q, data) => {
    return mongo.article.findOneAndUpdate(q, data, { new: true, upsert: true })
  },
  delete: _id => {
    return mongo.article.deleteById(_id)
  },
  findOneByEmail: email => {
    const condition = { email }

    return mongo.article.findOne(condition).then(res => res ? res.toObject() : null)
  },
  findOneByID: _id => {
    const condition = { _id }

    return mongo.article.findOne(condition).then(res => res ? res.toObject() : null)
  },

  find: async (query, { skip = 0, limit = 15, sort }, fields) => {
    const total = await mongo.article.find(query, fields).countDocuments()
    const articles = await mongo.article.find(query, fields, { skip: skip * limit, limit, sort }).populate("categories")

    return {
      total,
      articles
    }
  },
  findOne: async query => {
    const article = await mongo.article.findOne(query).populate("categories")
    .then(res => res ? res.toObject() : null)

    return article
  },
  groupByUser: ({ startDate, endDate, author }) => {

    let $match = {

    }

    if (author) {
      $match.author = Types.ObjectId(author)
    }

    let created_at = {}

    if (startDate) {
      created_at = {
        $gte: new Date(startDate)
      }
    }

    if (endDate) {
      created_at = { ...created_at,
        $lte: new Date(endDate) }
    }

    $match = Object.keys(created_at).length ? { ...$match, created_at } : $match
    const aggregate = [
      { $match },
      {
        $group: { _id: "$author", total: { $sum: 1 } }
      },
      { $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "writer",
      } },
          { "$unwind": "$writer" },
    ]


    return mongo.article.aggregate(aggregate)
  },
}


export default articleDa
