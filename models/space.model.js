module.exports = (sequelize, DataTypes) => {
  const Space = sequelize.define(
    "Space",
    {
      cid: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'contactables',
          key: 'cid'
        }
      },
      sname: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      room: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "spaces",
      timestamps: false,
      indexes: [
        { fields: ["cid"] },
      ],
    }
  );

  return Space;
};


