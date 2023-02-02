const express = require("express");
const catchAsync = require("../utils/catchAsync");
const Product = require("../models/product.model");
const productRoutes = express.Router();

const rangeFilterObject = (price) => {
  const rangeObj = price[0].includes("gte")
    ? { $gte: price[0].split(":")[1] * 1, $lte: price[1].split(":")[1] * 1 }
    : { $gte: price[1].split(":")[1] * 1, $lte: price[0].split(":")[1] * 1 };
  return { price: rangeObj };
};

// get all products
productRoutes.get(
  "/",
  catchAsync(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 100;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    const totalRecords =
      req.body && req.body.total ? parseInt(req.body.total) : -1;
    console.time("fetching products");
    let response;
    if (totalRecords == -1) {
      response = await Product.aggregate([
        {
          $facet: {
            products: [
              {
                $skip: limit * page,
              },
              {
                $limit: limit,
              },
            ],
            total: [
              {
                $group: {
                  _id: null,
                  count: { $sum: 1 },
                },
              },
            ],
          },
        },
      ]).then((data) => {
        return { products: data[0].products, total: data[0].total[0].count };
      });
    } else {
      response = await Product.aggregate([
        {
          $facet: {
            products: [
              {
                $skip: limit * page,
              },
              {
                $limit: limit,
              },
            ],
          },
        },
      ]).then((data) => {
        return { products: data[0].products, total: totalRecords };
      });
    }

    if (response) {
      if (response.products.length) {
        res.send({
          products: response.products,
          totalPages: response.total / limit,
        });
      } else {
        res.send({ products: [], message: "No products found for this criteria" });
      }
    } else {
      res.send({ message: "Error in fetching products" });
    }

    console.timeEnd("fetching products");
  })
);

productRoutes.get(
  "/filter",
  catchAsync(async (req, res) => {
    console.time("fetching products");
    let filter = req.query.category ? { category: req.query.category } : {};
    if (req.query.price) {
      filter = { ...filter, ...rangeFilterObject(req.query.price) };
    }
    const limit = req.query.limit ? parseInt(req.query.limit) : 100;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    console.log("filter", filter);
    const response = await Product.aggregate([
      {
        $match: { ...filter },
      },
      {
        $facet: {
          products: [{ $skip: limit * page }, { $limit: limit }],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]).then((data) => {
      return { products: data[0]?.products, total: data[0]?.totalCount[0]?.count || 0 };
    });
    if (response) {
      if (response.products.length) {
        res.send({
          products: response.products,
          totalPages: Math.ceil(response.total / limit),
        });
      } else {
        res.send({ products: [], message: "No products found for this criteria" });
      }
    } else {
      res.send({ message: "Error in fetching products" });
    }
    console.timeEnd("fetching products");
  })
);

module.exports = productRoutes;
