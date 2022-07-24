require("dotenv").config();
const PRODUCT = require("../model/product");
const connectDB = require("../db/connect");
const productData = require("../data/data.json");
connectDB(process.env.MONGO_URI);
const seedProduct = async (req, res) => {
  try {
    await PRODUCT.deleteMany();
    console.log("products are deleted");

    await PRODUCT.insertMany(productData);
    console.log("All Products are added");

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedProduct();
