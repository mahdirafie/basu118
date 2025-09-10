module.exports = (sequelize, DataTypes) => {
  const ShareGroup = sequelize.define(
    "ShareGroup",
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
      gid: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'groups',
          key: 'gid'
        }
      },
      sent_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "share_groups",
      timestamps: false,
      indexes: [
        { fields: ["emp_id"] },
        { fields: ["gid"] },
        { fields: ["val_id"] },
      ],
    }
  );

  return ShareGroup;
};


