const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
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
    default: "FOR_SALE",
  },
},
  {
    timestamps: true,
  });
module.exports = mongoose.model("Products", productsSchema);
