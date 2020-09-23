/* eslint-disable no-invalid-this */

import { Schema, model } from "mongoose"
import { createSlug } from "libs/moggoseMiddleware"


const $ = {
  name: "Ads",
}

$.schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  summary: String,
  type: {
    type: String,
    required: true,
    default: "main",
  },
  categories_show: [{
    type: Schema.Types.ObjectId,
    ref: "Category"
  }],
  articles_show: [{
    type: Schema.Types.ObjectId,
    ref: "Article"
  }],
  refrence_url: String,
  slug: {
    type: String,
    required: true,
    index: true,
    trim: true,
    unique: true,
  },
  start_at: Date,
  end_at: Date,
  primaryImage: Number,
  images: [String],
  content: String
},
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  })


$.schema.pre(["validate", "findOneAndUpdate"], createSlug)
const $model = model($.name, $.schema)

$model.createIndexes()

export default $model
