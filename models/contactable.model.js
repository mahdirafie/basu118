module.exports = (sequelize, DataTypes) => {
  const Contactable = sequelize.define(
    "Contactable",
    {
      cid: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      tableName: "contactables",
      timestamps: false,
    }
  );

  return Contactable;
};
