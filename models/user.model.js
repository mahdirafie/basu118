module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
      },
      full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );

  return User;
};
