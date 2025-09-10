module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      cid: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'contactables',
          key: 'cid'
        }
      },
      pname: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "posts",
      timestamps: false,
      indexes: [
        { fields: ["cid"] },
      ],
    }
  );

  return Post;
};


