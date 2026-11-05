import swaggerJsdoc from "swagger-jsdoc";

const port = process.env.PORT || 8000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dhaka Traffic Congestion Prediction API",
      version: "1.0.0",
      description:
        "Backend prototype for collecting traffic data and suggesting best departure time & route for Dhaka, Bangladesh.",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
