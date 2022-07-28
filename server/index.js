require("dotenv").config();
const cors = require("cors");
const express = require("express");
const db = require("./db/connect");
const productsRoute = require("./routes/product");
const authenticationRoute = require("./routes/user");
const app = express();
const PORT = process.env.PORT;
const errorMiddleware = require("./middlewares/errors");
const cookieParser = require("cookie-parser");
const Limiter = require("express-rate-limit");

//Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.stack}`);
  console.log("Shutting down due to Uncaught Exceptions");
  process.exit(1);
});

//Defining the rate limit for the authentication route
const rateLimiter = Limiter({
  windowMs: 5 * 60 * 1000,
  max: 2,
});

//middleWares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(errorMiddleware);
//routes
app.use("/api/v1", productsRoute);
app.use("/api/v1", rateLimiter, authenticationRoute);
//errorMiddleware

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
