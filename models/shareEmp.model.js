module.exports = (sequelize, DataTypes) => {
  const ShareEmp = sequelize.define(
    "ShareEmp",
    {
      val_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'personal_attribute_values',
          key: 'val_id'
        }
      },
      emp_id_sender: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'emp_id'
        }
      },
      emp_id_receiver: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'emp_id'
        }
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "share_emps",
      timestamps: false,
      indexes: [
        { fields: ["emp_id_sender"] },
        { fields: ["emp_id_receiver"] },
        { fields: ["val_id"] },
      ],
    }
  );

  return ShareEmp;
};


