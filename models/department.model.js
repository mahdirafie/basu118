module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define(
    "Department",
    {
      did: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      dname: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      fid: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'faculties',
          key: 'fid'
        }
      },
    },
    {
      tableName: "departments",
      timestamps: false,
      indexes: [
        { fields: ["fid"] },
      ],
    }
  );

  return Department;
};


