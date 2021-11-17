if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const database = require("./helpers/database")
const fetcher = require("./helpers/fetcher")

const makeApp = require("./app");
const app = makeApp(database, fetcher);

const expressJSDocSwagger = require('express-jsdoc-swagger');
const options = {
  info: {
    version: '1.0.0',
    title: 'Suchon Site',
    license: {
      name: 'MIT',
    },
    description: 'Suchon Site API documentation'
  },
  security: {
    BasicAuth: {
      type: 'http',
      scheme: 'basic',
    },
  },
  baseDir: __dirname,
  // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
  filesPattern: './**/*.js',
  // URL where SwaggerUI will be rendered
  swaggerUIPath: '/api-docs',
  // Expose OpenAPI UI
  exposeSwaggerUI: true,
  // Expose Open API JSON Docs documentation in `apiDocsPath` path.
  exposeApiDocs: false,
  // Open API JSON Docs endpoint.
  apiDocsPath: '/v3/api-docs',
  // Set non-required fields as nullable by default
  notRequiredAsNullable: false,
  // You can customize your UI options.
  // you can extend swagger-ui-express config. You can checkout an example of this
  // in the `example/configuration/swaggerOptions.js`
  swaggerUiOptions: {},
  // multiple option in case you want more that one instance
  multiple: true,
};

expressJSDocSwagger(app)(options);

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log("Connected to port " + port);
});