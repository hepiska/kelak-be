/* eslint-disable no-invalid-this */

import { Schema, model } from "mongoose"
import { createSlug } from "libs/moggoseMiddleware"


const $ = {
  name: "Article",
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
  categories: [{
    type: Schema.Types.ObjectId,
    ref: "Category"
  }],
  isHeadline: Boolean,
  summary: String,
  slug: {
    type: String,
    required: true,
    index: true,
    trim: true,
    unique: true,
  },
  primaryImage: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
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
