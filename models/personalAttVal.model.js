module.exports = (sequelize, DataTypes) => {
  const PersonalAttVal = sequelize.define(
    "PersonalAttVal",
    {
      val_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      att_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      tableName: "personal_attribute_values",
      timestamps: false,
      indexes: [
        { fields: ["att_id"] },
      ],
    }
  );

  return PersonalAttVal;
};


