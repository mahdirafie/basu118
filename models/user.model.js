module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      phone: {
        type: DataTypes.STRING(20),
        primaryKey: true,
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
