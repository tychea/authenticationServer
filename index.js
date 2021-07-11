require("dotenv");

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
// set port, listen for requests
const PORT = process.env.PORT || 5000;
//connect to mongodb
connectDB();
var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json({ extended: false }));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//User Routes
app.use("/users", require("./routes/api/users"));

//default Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to steven application.",
    env: process.env.mongoURI,
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
