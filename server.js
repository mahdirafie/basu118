const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const db = require("./models");
const facultyRoutes = require("./routes/faculty.routes");
const departmentRoutes = require("./routes/department.routes");
const groupRoutes = require("./routes/group.routes");
const personalAttRoutes = require("./routes/personalAtt.routes");
const personalAttValRoutes = require("./routes/personalAttVal.routes");
const userRoutes = require("./routes/user.routes");
const employeeRoutes = require("./routes/employee.routes");
const empOperationsRoutes = require("./routes/empOperations.routes");
const ehpavRoutes = require("./routes/ehpav.routes");
const remindRoutes = require("./routes/remind.routes");
const groupMembershipRoutes = require("./routes/groupMembership.routes");
const shareGroupRoutes = require("./routes/shareGroup.routes");
const shareEmpRoutes = require("./routes/shareEmp.routes");
const postRoutes = require("./routes/post.routes");
const spaceRoutes = require("./routes/space.routes");
const espRoutes = require("./routes/esp.routes");
const favoriteCategoryRoutes = require("./routes/favoriteCategory.routes");
const favoritesRoutes = require("./routes/favorites.routes");
const contactInfoRoutes = require("./routes/contactInfo.routes");

const app = express();
const PORT = 4000;

app.use(express.json());

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Basu 118 API",
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
app.use("/api/faculties", facultyRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/personal-attributes", personalAttRoutes);
app.use("/api/personal-attribute-values", personalAttValRoutes);
app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/emp-operations", empOperationsRoutes);
app.use("/api/ehpavs", ehpavRoutes);
app.use("/api/reminds", remindRoutes);
app.use("/api/group-memberships", groupMembershipRoutes);
app.use("/api/share-groups", shareGroupRoutes);
app.use("/api/share-emps", shareEmpRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/spaces", spaceRoutes);
app.use("/api/esps", espRoutes);
app.use("/api/favorite-categories", favoriteCategoryRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/contact-infos", contactInfoRoutes);

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
