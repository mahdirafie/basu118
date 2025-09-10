module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "Employee",
    {
      emp_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      cid: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        references: {
          model: 'contactables',
          key: 'cid'
        }
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'phone'
        }
      },
      personel_no: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "employees",
      timestamps: false,
      indexes: [
        { fields: ["cid"], unique: true },
        { fields: ["phone"], unique: true },
      ],
    }
  );

  return Employee;
};
