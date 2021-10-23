import { mongo } from "models"


const adsData = {
  create: data => {
    return mongo.ads.create(data).then(res => {
      return res ? res.toObject() : null
    })
  },
  update: (q, data) => {
    return mongo.ads.findOneAndUpdate(q, data, { new: true, upsert: true })
  },
  delete: _id => {
    return mongo.ads.deleteById(_id)
  },
  findOneByID: _id => {
    const condition = { _id }

    return mongo.ads.findOne(condition).populate("categories_show, articles_show")
.then(res => res ? res.toObject() : null)
  },

  find: async (query, { skip = 0, limit = 15, sort }, fields) => {
    const total = await mongo.ads.find(query, fields).countDocuments()
    const ads = await mongo.ads.find(query, fields, { skip: skip * limit, limit, sort })
    .populate("categories_show, articles_show")

    return {
      total,
      ads
    }
  },
  findOne: async query => {
    const article = await mongo.ads.findOne(query).then(res => res ? res.toObject() : null)

    return article
  }
}


export default adsData
