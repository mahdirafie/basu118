module.exports = (sequelize, DataTypes) => {
  const ESP = sequelize.define(
    "ESP",
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
      sid: {
        // FK to Space (its PK is cid)
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'spaces',
          key: 'cid'
        }
      },
      pid: {
        // FK to Post (its PK is cid)
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'cid'
        }
      },
    },
    {
      tableName: "esps",
      timestamps: false,
      indexes: [
        { fields: ["emp_id"] },
        { fields: ["sid"] },
        { fields: ["pid"] },
        { fields: ["emp_id", "sid", "pid"], unique: true },
      ],
    }
  );

  return ESP;
};


