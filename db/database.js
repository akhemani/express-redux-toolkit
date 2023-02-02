const mongoose = require("mongoose");

let _db;

const initDB = (callBack) => {
  if (_db) {
    console.log("Db is already initialized!");
    return callback(null, _db);
  }
  mongoose
    .connect("mongodb://localhost:27017/dbtesting", {
      useNewUrlParser: true,
    })
    .then((res) => {
      _db = res;
      callBack(null, _db);
    })
    .catch((err) => {
      callBack(err);
    });
  const conn = mongoose.connection;
  conn.on("connected", () => console.log("Database is connected successfully"));
  conn.on("disconnected", () =>
    console.log("Database is disconnected successfully")
  );
  conn.on("error", console.error.bind(console, "Connection error"));
};

const getDB = () => {
  if (!_db) throw Error("Database not initialised");
  return _db;
};

const getDBInfo = () => {
  const connection = mongoose.connection;
  if (connection) {
    connection.db
      .listCollections()
      .toArray()
      .then((res) => res.forEach((coll) => console.log("DB user:", coll.name)));
  } else {
    throw Error("DB not initialised");
  }
};

module.exports = {
  initDB,
  getDB,
  getDBInfo,
};
