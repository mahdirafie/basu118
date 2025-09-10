module.exports = (sequelize, DataTypes) => {
  const NonFacultyMember = sequelize.define(
    "NonFacultyMember",
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
      workarea: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "non_faculty_members",
      timestamps: false,
      indexes: [
        { fields: ["emp_id"] },
      ],
    }
  );

  return NonFacultyMember;
};
