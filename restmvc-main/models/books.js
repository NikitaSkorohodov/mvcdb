const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('books', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    isbn: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pageCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    publishedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    thumbnailUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    shortDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    longDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'books',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
