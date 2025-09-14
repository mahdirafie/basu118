module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "Employee",
    {
      emp_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
      uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'uid'
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
      national_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      personel_no: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "employees",
      timestamps: false,
      indexes: [
        { fields: ["cid"], unique: true },
        { fields: ["uid"] , unique: true},
        { fields: ["phone"], unique: true },
        { fields: ["national_code"], unique: true },
      ],
    }
  );

  return Employee;
};
