require("dotenv").config();
const cors = require("cors");
const express = require("express");
const db = require("./db/connect");
const app = express();
const PORT = process.env.PORT;
const productRoute = require("./routes/product");

//middleWares
app.use(cors());
app.use(express.json());

//routes
app.use("api/v1/", productRoute);

const start = async () => {
  try {
    await db(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server Listening on port:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
