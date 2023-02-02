const mongoose = require("mongoose");

const productModel = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
});

const Product = mongoose.model("products", productModel);

module.exports = Product;
