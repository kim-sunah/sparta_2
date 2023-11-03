const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
  createdAt: {
    type: String,
  },
});
module.exports = mongoose.model("Products", productsSchema);
