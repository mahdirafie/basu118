module.exports = (sequelize, DataTypes) => {
  const Favorites = sequelize.define(
    "Favorites",
    {
      cid: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
      },
      favcat_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      tableName: "favorites",
      timestamps: false,
      indexes: [
        { fields: ["cid"] },
        { fields: ["favcat_id"] },
      ],
    }
  );

  return Favorites;
};
