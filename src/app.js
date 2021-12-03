const getDataFromGov = require("./routes/getDataFromGov.route");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

function makeApp(database, fetcher){

  const express = require("express"),
  cors = require("cors"),
  bodyParser = require("body-parser"),
  // schedule = require("./cron-job"),
  peopleRoutes = require("./routes/people.route"),
  getGov = require("./routes/getDataFromGov.route")

  const uri = process.env.DATABASE_URI

  const app = express();
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  database.connectDB(uri);

  app.use( (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With,accesstoken');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
  })

  // app.use(cors());
  app.use("/",getDataFromGov(database, fetcher))
  app.use("/people", peopleRoutes(database));

  return app
}

module.exports = makeApp