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
db.Employee = require("./employee.model")(sequelize, DataTypes);
db.EmpOperations = require("./empOperations.model")(sequelize, DataTypes);
db.FacultyMember = require("./facultyMember.model")(sequelize, DataTypes);
db.NonFacultyMember = require("./nonFacultyMember.model")(sequelize, DataTypes);
db.GroupMembership = require("./groupMembership.model")(sequelize, DataTypes);
db.Remind = require("./remind.model")(sequelize, DataTypes);
db.EHPAV = require("./ehpav.model")(sequelize, DataTypes);
db.ShareGroup = require("./shareGroup.model")(sequelize, DataTypes);
db.ShareEmp = require("./shareEmp.model")(sequelize, DataTypes);
db.Post = require("./post.model")(sequelize, DataTypes);
db.Space = require("./space.model")(sequelize, DataTypes);
db.ESP = require("./esp.model")(sequelize, DataTypes);
db.OTP = require("./otp.model")(sequelize, DataTypes);

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

// Employee associations
// Employee to Contactable (one-to-one)
db.Employee.belongsTo(db.Contactable, {
  foreignKey: "cid",
  as: "contactable",
});
db.Contactable.hasOne(db.Employee, {
  foreignKey: "cid",
  as: "employee",
});

// Employee to User (one-to-one)
db.Employee.belongsTo(db.User, {
  foreignKey: "uid",
  as: "user",
});
db.User.hasOne(db.Employee, {
  foreignKey: "uid",
  as: "employee",
});

// Employee to EmpOperations (one-to-many)
db.Employee.hasMany(db.EmpOperations, {
  foreignKey: "emp_id",
  as: "operations",
});
db.EmpOperations.belongsTo(db.Employee, {
  foreignKey: "emp_id",
  as: "employee",
});

// Employee to FacultyMember (one-to-one)
db.Employee.hasOne(db.FacultyMember, {
  foreignKey: "emp_id",
  as: "facultyMember",
});
db.FacultyMember.belongsTo(db.Employee, {
  foreignKey: "emp_id",
  as: "employee",
});

// FacultyMember to Department (many-to-one)
db.FacultyMember.belongsTo(db.Department, {
  foreignKey: "did",
  as: "department",
});
db.Department.hasMany(db.FacultyMember, {
  foreignKey: "did",
  as: "facultyMembers",
});

// Employee to NonFacultyMember (one-to-one)
db.Employee.hasOne(db.NonFacultyMember, {
  foreignKey: "emp_id",
  as: "nonFacultyMember",
});
db.NonFacultyMember.belongsTo(db.Employee, {
  foreignKey: "emp_id",
  as: "employee",
});

// Employee ↔ Group (many-to-many via GroupMembership)
db.Employee.belongsToMany(db.Group, {
  through: db.GroupMembership,
  foreignKey: "emp_id",
  otherKey: "gid",
  as: "groups",
});
db.Group.belongsToMany(db.Employee, {
  through: db.GroupMembership,
  foreignKey: "gid",
  otherKey: "emp_id",
  as: "employees",
});

// Employee ↔ Contactable (many-to-many via Remind)
db.Employee.belongsToMany(db.Contactable, {
  through: db.Remind,
  foreignKey: "emp_id",
  otherKey: "cid",
  as: "contactablesReminded",
});
db.Contactable.belongsToMany(db.Employee, {
  through: db.Remind,
  foreignKey: "cid",
  otherKey: "emp_id",
  as: "employeesReminded",
});

// ShareGroup associations
db.PersonalAttVal.hasMany(db.ShareGroup, { foreignKey: "val_id", as: "shareGroups" });
db.ShareGroup.belongsTo(db.PersonalAttVal, { foreignKey: "val_id", as: "personalAttVal" });
db.Employee.hasOne(db.ShareGroup, { foreignKey: "emp_id", as: "shareGroup" });
db.ShareGroup.belongsTo(db.Employee, { foreignKey: "emp_id", as: "employee" });
db.Group.hasOne(db.ShareGroup, { foreignKey: "gid", as: "shareGroup" });
db.ShareGroup.belongsTo(db.Group, { foreignKey: "gid", as: "group" });

// ShareEmp associations
db.PersonalAttVal.hasMany(db.ShareEmp, { foreignKey: "val_id", as: "shareEmps" });
db.ShareEmp.belongsTo(db.PersonalAttVal, { foreignKey: "val_id", as: "personalAttVal" });
db.Employee.hasOne(db.ShareEmp, { foreignKey: "emp_id_sender", as: "shareSent" });
db.ShareEmp.belongsTo(db.Employee, { foreignKey: "emp_id_sender", as: "sender" });
db.Employee.hasOne(db.ShareEmp, { foreignKey: "emp_id_receiver", as: "shareReceived" });
db.ShareEmp.belongsTo(db.Employee, { foreignKey: "emp_id_receiver", as: "receiver" });

// Post associations
db.Contactable.hasOne(db.Post, { foreignKey: "cid", as: "post" });
db.Post.belongsTo(db.Contactable, { foreignKey: "cid", as: "contactable" });

// Space associations
db.Contactable.hasOne(db.Space, { foreignKey: "cid", as: "space" });
db.Space.belongsTo(db.Contactable, { foreignKey: "cid", as: "contactable" });

// ESP associations (many-to-many relationships)
db.Employee.hasMany(db.ESP, { foreignKey: "emp_id", as: "esps" });
db.ESP.belongsTo(db.Employee, { foreignKey: "emp_id", as: "employee" });
db.Space.hasMany(db.ESP, { foreignKey: "sid", as: "esps" });
db.ESP.belongsTo(db.Space, { foreignKey: "sid", as: "space" });
db.Post.hasMany(db.ESP, { foreignKey: "pid", as: "esps" });
db.ESP.belongsTo(db.Post, { foreignKey: "pid", as: "post" });

// OTP: standalone by phone (no FK to User for registration flow)


db.sequelize = sequelize;
db.Sequelize = sequelize.constructor;

module.exports = db;