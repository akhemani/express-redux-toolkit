const express = require("express");
const Order = require("../models/cart.model");
const catchAsync = require("../utils/catchAsync");
const Product = require("../models/product.model");
const orderRoutes = express.Router();

orderRoutes.post(
  "/",
  catchAsync(async (req, res) => {
    console.time("creating order");
    const data = req.body;
    const response = await Order.create(data).then((data) => {
      return { message: "created order" };
    });
    if (response) {
      res.send({
        ...response,
      });
    } else {
      res.send({ message: "Error in creating order" });
    }
    console.timeEnd("creating order");
  })
);

orderRoutes.get(
  "/",
  catchAsync(async (req, res) => {
    console.time("getting orders");
    const response = await Order.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productOrders",
        },
      },
    ]).then((data) => {
      console.log(data);
      let obj = {};
      data.forEach((res) => {
        const orderDetails = [];
        res.productOrders.forEach((uO, index) => {
          orderDetails.push({
            name: uO.name,
            quantity: res.quantity[index],
          });
        });
        obj[res._id] = { userOrder: orderDetails, total: res.total };
      });
      return { data: obj };
    });

    if (response) {
      res.send({
        ...response,
      });
    } else {
      res.send({ message: "Error in creating order" });
    }
    console.timeEnd("getting orders");
  })
);

module.exports = orderRoutes;
