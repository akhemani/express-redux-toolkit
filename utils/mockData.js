const Product = require("../models/product.model");
const casual = require("casual");

const insertMockData = async (length) => {
  console.log("Cleaning db");
  console.time("time taken by db to delete data");
  await Promise.resolve(Product.deleteMany({}));
  console.log("DB cleaned");
  console.timeEnd("time taken by db to delete data");

  console.log("Inserting", length, " dummy products");
  console.time("time taken by db to insert data");
  const dummyProducts = [...new Array(length)].map((_) => ({
    name: casual.name,
    price: casual.integer(from = 20, to = 100),
    category: casual.country,
  }));
  await Promise.resolve(Product.insertMany(dummyProducts));
  console.log("Data inserted");
  console.timeEnd("time taken by db to insert data");
};

module.exports = insertMockData;
