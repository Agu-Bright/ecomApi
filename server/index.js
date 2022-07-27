require("dotenv").config();
const cors = require("cors");
const express = require("express");
const db = require("./db/connect");
const productsRoute = require("./routes/product");
const authenticationRoute = require("./routes/user");
const app = express();
const PORT = process.env.PORT;
const errorMiddleware = require("./middlewares/errors");

//Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.stack}`);
  console.log("Shutting down due to Uncaught Exceptions");
  process.exit(1);
});

//middleWares
app.use(cors());
app.use(express.json());

//routes
app.use("/api/v1", productsRoute);
app.use("/api/v1", authenticationRoute);
//errorMiddleware
app.use(errorMiddleware);

const start = async () => {
  try {
    await db(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server Listening on port:${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
    console.log("Shutting down the server due to unhandled promise rejection");
    process.exit(1);
  }
};
start();
