const mongoose = require("mongoose");

const orderModel = new mongoose.Schema({
  productId: { type: [mongoose.Schema.ObjectId], required: true },
  quantity: [],
  total: Number,
});

const Order = mongoose.model("orders", orderModel);

module.exports = Order;
