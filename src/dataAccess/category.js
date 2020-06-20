import { mongo } from "models"


const categotyDa = {
  create: data => {
    return mongo.category.create(data).then(res => {
      return res ? res.toObject() : null
    })
  },
  update: (q, data) => {
    return mongo.article.findOneAndUpdate(q, data, { new: true, upsert: true })
  },
  delete: _id => {
    return mongo.article.deleteById(_id)
  },

  find: async (query, { skip = 0, limit = 15, sort }, fields) => {
    const total = await mongo.category.find(query, fields).countDocuments()
    const categories = await mongo.category.find(query, fields, { skip: skip * limit, limit, sort })


    return {
      total,
      categories
    }
  },
  findOne: async query => {
    const category = await mongo.category.findOne(query).then(res => res ? res.toObject() : null)

    return category
  },
}

export default categotyDa
