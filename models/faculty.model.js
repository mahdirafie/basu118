module.exports = (sequelize, DataTypes) => {
  const Faculty = sequelize.define(
    "Faculty",
    {
      fid: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      fname: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "faculties",
      timestamps: false,
    }
  );

  return Faculty;
};


