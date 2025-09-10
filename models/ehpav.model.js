module.exports = (sequelize, DataTypes) => {
  const EHPAV = sequelize.define(
    "EHPAV",
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
      emp_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'emp_id'
        }
      },
    },
    {
      tableName: "ehpavs",
      timestamps: false,
      indexes: [
        { fields: ["val_id"] },
        { fields: ["emp_id"] },
      ],
    }
  );

  return EHPAV;
};
