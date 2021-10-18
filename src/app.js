if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express"),
  mongoose = require("mongoose"),
  cors = require("cors"),
  bodyParser = require("body-parser"),
  people_routes = require("./routes/people.route")

const uri = process.env.DATABASE_URI

mongoose.Promise = global.Promise;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
  })
  .then(
    () => {
      console.log("Database conected");
    },
    (error) => {
      console.log("cannot connect to database" + error);
    }
  );

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors());
app.use("/people", people_routes);

// const port = process.env.PORT || 4000;
// const server = app.listen(port, () => {
//   console.log("Connected to port " + port);
// });

module.exports = app;