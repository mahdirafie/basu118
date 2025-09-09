const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// Models registry
const db = {};

// Define models
db.Faculty = require("./faculty.model")(sequelize, DataTypes);
db.Department = require("./department.model")(sequelize, DataTypes);
db.Group = require("./group.model")(sequelize, DataTypes);
db.PersonalAtt = require("./personalAtt.model")(sequelize, DataTypes);
db.PersonalAttVal = require("./personalAttVal.model")(sequelize, DataTypes);
db.User = require("./user.model")(sequelize, DataTypes);
db.FavoriteCategory = require("./favoriteCategory.model")(sequelize, DataTypes);
db.Contactable = require("./contactable.model")(sequelize, DataTypes);
db.Favorites = require("./favorites.model")(sequelize, DataTypes);
db.ContactInfo = require("./contactInfo.model")(sequelize, DataTypes);

// Associations
db.Department.belongsTo(db.Faculty, {
  foreignKey: "fid",
  as: "faculty",
});
db.Faculty.hasMany(db.Department, {
  foreignKey: "fid",
  as: "departments",
});

db.PersonalAttVal.belongsTo(db.PersonalAtt, {
  foreignKey: "att_id",
  as: "attribute",
});
db.PersonalAtt.hasMany(db.PersonalAttVal, {
  foreignKey: "att_id",
  as: "values",
});

// New model associations
// User to FavoriteCategory (one-to-many)
db.User.hasMany(db.FavoriteCategory, {
  foreignKey: "phone",
  as: "favoriteCategories",
});
db.FavoriteCategory.belongsTo(db.User, {
  foreignKey: "phone",
  as: "user",
});

// Contactable to Favorites (one-to-many)
db.Contactable.hasMany(db.Favorites, {
  foreignKey: "cid",
  as: "favorites",
});
db.Favorites.belongsTo(db.Contactable, {
  foreignKey: "cid",
  as: "contactable",
});

// FavoriteCategory to Favorites (one-to-many)
db.FavoriteCategory.hasMany(db.Favorites, {
  foreignKey: "favcat_id",
  as: "favorites",
});
db.Favorites.belongsTo(db.FavoriteCategory, {
  foreignKey: "favcat_id",
  as: "favoriteCategory",
});

// Contactable to ContactInfo (one-to-many)
db.Contactable.hasMany(db.ContactInfo, {
  foreignKey: "cid",
  as: "contactInfos",
});
db.ContactInfo.belongsTo(db.Contactable, {
  foreignKey: "cid",
  as: "contactable",
});

db.sequelize = sequelize;
db.Sequelize = sequelize.constructor;

module.exports = db;


