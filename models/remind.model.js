module.exports = (sequelize, DataTypes) => {
  const Remind = sequelize.define(
    "Remind",
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
      emp_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'emp_id'
        }
      },
      time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "reminds",
      timestamps: false,
      indexes: [
        { fields: ["cid"] },
        { fields: ["emp_id"] },
      ],
    }
  );

  return Remind;
};
