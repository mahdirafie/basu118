const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const db = require("./models");

const app = express();
const PORT = 4000;

app.use(express.json());

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Node API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./routes/*.js", "./server.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocs);
});

// Initialize database connection
db.sequelize
  .authenticate()
  .then(async () => {
    console.log("Database connected.");
    // Ensure indexes and table exist; set to false to avoid destructive ops
    await db.sequelize.sync({ alter: false });
  })
  .catch((err) => {
    console.error("DB connection error:", err.message);
  });

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
