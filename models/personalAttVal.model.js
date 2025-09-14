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
        references: {
          model: 'personal_attributes',
          key: 'att_id'
        },
        unique: true
      },
    },
    {
      tableName: "personal_attribute_values",
      timestamps: false,
      indexes: [
        { fields: ["att_id"], unique: true },
      ],
    }
  );

  return PersonalAttVal;
};


