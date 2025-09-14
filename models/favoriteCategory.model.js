module.exports = (sequelize, DataTypes) => {
  const FavoriteCategory = sequelize.define(
    "FavoriteCategory",
    {
      favcat_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: 'users',
          key: 'phone',
        }
      },
    },
    {
      tableName: "favorite_categories",
      timestamps: false,
      indexes: [
        { fields: ["phone"] },
      ],
    }
  );

  return FavoriteCategory;
};
