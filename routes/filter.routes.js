const express = require("express");
const catchAsync = require("../utils/catchAsync");
const Product = require("../models/product.model");
const filterRoutes = express.Router();

filterRoutes.get(
  "/",
  catchAsync(async (req, res) => {
    console.time("fetching stats");
    const response = await Product.aggregate([
      {
        $facet: {
          categories: [
            {
              $group: {
                _id: null,
                categories: { $addToSet: "$category" },
              },
            },
          ],
          minPrice: [
            {
              $sort: {
                price: 1,
              },
            },
            {
              $limit: 1,
            },
          ],
          maxPrice: [
            {
              $sort: {
                price: -1,
              },
            },
            {
              $limit: 1,
            },
          ],
        },
      },
      {
        $project: {
          categories: "$categories",
          min: { $first: "$minPrice.price" },
          max: { $first: "$maxPrice.price" },
        },
      },
    ]).then((data) => {
      console.log(data);
      return {
        categories: data[0].categories[0].categories.sort(),
        min: data[0].min,
        max: data[0].max,
      };
    });
    if (response) {
      res.send({
        categories: response.categories,
        min: response.min,
        max: response.max,
      });
    } else {
      res.send({ message: "Error in fetching filter stats" });
    }
    console.timeEnd("fetching stats");
  })
);

module.exports = filterRoutes;