import { mongo } from "models"


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
    const articles = await mongo.article.find(query, fields, { skip: skip * limit, limit, sort })

    return {
      total,
      articles
    }
  },
  findOne: async query => {
    const article = await mongo.articles.findOne(query).then(res => res ? res.toObject() : null)

    return article
  },
}


export default articleDa
