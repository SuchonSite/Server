if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express"),
  mongoose = require("mongoose"),
  cors = require("cors"),
  bodyParser = require("body-parser"),
  peopleRoutes = require("./routes/people.route")
  getGov = require("./routes/getDataFromGov.route")

const {connectDB} = require("./database");

const uri = process.env.DATABASE_URI

connectDB(uri);

// mongoose.Promise = global.Promise;
// mongoose
//   .connect(uri, {
//     useNewUrlParser: true,
//   })
//   .then(
//     () => {
//       console.log("Database conected");
//     },
//     (error) => {
//       console.log("cannot connect to database" + error);
//     }
//   );

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use( (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With,accesstoken');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
})

app.use(cors());
app.use("/",getGov)
app.use("/people", peopleRoutes);

module.exports = app;