module.exports = (sequelize, DataTypes) => {
  const FacultyMember = sequelize.define(
    "FacultyMember",
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
      did: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'departments',
          key: 'did'
        }
      },
    },
    {
      tableName: "faculty_members",
      timestamps: false,
      indexes: [
        { fields: ["emp_id"] },
        { fields: ["did"] },
      ],
    }
  );

  return FacultyMember;
};
