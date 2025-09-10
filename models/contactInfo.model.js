module.exports = (sequelize, DataTypes) => {
  const ContactInfo = sequelize.define(
    "ContactInfo",
    {
      phone_number: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
      },
      range: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      subrange: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      forward: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      extension: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      cid: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'contactables',
          key: 'cid'
        }
      },
    },
    {
      tableName: "contact_infos",
      timestamps: false,
      indexes: [
        { fields: ["cid"] },
      ],
    }
  );

  return ContactInfo;
};
