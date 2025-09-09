module.exports = (sequelize, DataTypes) => {
  const PersonalAtt = sequelize.define(
    "PersonalAtt",
    {
      att_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      is_sharable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "personal_attributes",
      timestamps: false,
    }
  );

  return PersonalAtt;
};


