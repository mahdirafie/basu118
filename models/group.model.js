module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define(
    "Group",
    {
      gid: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      gname: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "groups",
      timestamps: false,
    }
  );

  return Group;
};


