const express = require("express");
const cors = require("cors");

const { initDB, getDBInfo } = require("./db/database");
const insertMockData = require("./utils/mockData");
const productRoutes = require("./routes/product.routes");
const filterRoutes = require("./routes/filter.routes");
const orderRoutes = require("./routes/cart.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

initDB((err, db) => {
  if (err) console.log("Error in connecting with db", err);
  else {
    try {
      console.log("DB connected");
      getDBInfo();
      initApp();
      // uncomment for only first time
      // insertMockData(100);
      app.use("/api/v1/products", productRoutes);
      app.use("/api/v1/filterStats", filterRoutes);
      app.use("/api/v1/orders", orderRoutes);
    } catch (err) {
      console.log("Error in setting up database", err);
    }
  }
});

const initApp = () => {
  app.listen(8080, () => console.log("Server is listening on port 8080"));
};
