module.exports = (sequelize, DataTypes) => {
  const EmpOperations = sequelize.define(
    "EmpOperations",
    {
      emp_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'emp_id'
        }
      },
      value: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      tableName: "emp_operations",
      timestamps: false,
      indexes: [
        { fields: ["emp_id"] },
      ],
    }
  );

  return EmpOperations;
};
