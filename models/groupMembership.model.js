module.exports = (sequelize, DataTypes) => {
  const GroupMembership = sequelize.define(
    "GroupMembership",
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
      gid: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'groups',
          key: 'gid'
        }
      },
    },
    {
      tableName: "group_memberships",
      timestamps: false,
      indexes: [
        { fields: ["emp_id"] },
        { fields: ["gid"] },
      ],
    }
  );

  return GroupMembership;
};
