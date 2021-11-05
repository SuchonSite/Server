if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const database = require("./helpers/database")
const fetcher = require("./helpers/fetcher")

const makeApp = require("./app");
const app = makeApp(database, fetcher);

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log("Connected to port " + port);
});