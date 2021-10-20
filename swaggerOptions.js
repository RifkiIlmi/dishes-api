const SwaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Rumbai Resto And Caffe",
      version: "1.0.0",
      description: "A Simple Swagger-Express API Library",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./routes/*.js", "./doc/*.yaml"],
};

const specs = SwaggerJsDoc(options);

module.exports = specs;
