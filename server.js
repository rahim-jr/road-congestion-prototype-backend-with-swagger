import "dotenv/config";
import morgan from "morgan";
import express from "express";
import cors from "cors";
// morgan removed to keep terminal output clean
import swaggerUi from "swagger-ui-express";

// Importing db initializes the SQLite database & schema
import "./src/config/db.js";

import roadRoutes from "./src/routes/roadRoutes.js";
import trafficRoutes from "./src/routes/trafficRoutes.js";
import routeRoutes from "./src/routes/routeRoutes.js";
import notFound from "./src/middlewares/notFound.js";
import errorHandler from "./src/middlewares/errorHandler.js";
import swaggerSpec from "./swagger.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Favicon & Docs redirect
app.get("/favicon.ico", (req, res) => res.status(204).end());
app.get("/docs", (req, res) => res.redirect("/api/docs/"));

// Swagger docs (served under /api)
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root index endpoint
app.get(["/", "/api"], (req, res) => {
  res.status(200).json({
    name: "Dhaka Traffic Congestion Prediction API",
    version: "1.0.0",
    docs: "/api/docs",
    health: "/health",
    endpoints: {
      roads: "/api/roads",
      trafficReport: "/api/traffic/report",
      trafficData: "/api/traffic/data",
      currentTraffic: "/api/traffic/current",
      trafficHistory: "/api/traffic/history",
      routeSuggest: "/api/route/suggest",
    },
  });
});

// API routes (base URL /api)
app.use("/api/roads", roadRoutes);
app.use("/api/traffic", trafficRoutes);
app.use("/api/route", routeRoutes);

// Health check
app.get(["/health", "/api/health"], (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 + error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api/docs/`);
});
