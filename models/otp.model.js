module.exports = (sequelize, DataTypes) => {
  const OTP = sequelize.define(
    "OTP",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      code: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
          isIranianPhone(value) {
            const iranianPhoneRegex = /^(\+98|0098|0)?9\d{9}$/;
            
            if (!iranianPhoneRegex.test(value)) {
              throw new Error('Phone number must be a valid Iranian phone number');
            }
          }
        }
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "otps",
      timestamps: false,
      indexes: [
        { fields: ["phone"], unique: true },
        { fields: ["expires_at"] },
      ],
    }
  );

  return OTP;
};


