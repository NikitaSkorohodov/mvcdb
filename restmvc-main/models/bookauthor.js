const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bookauthor', {
    BookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'books',
        key: 'id'
      }
    },
    AuthorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'authors',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'bookauthor',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "BookId" },
          { name: "AuthorId" },
        ]
      },
      {
        name: "AuthorId",
        using: "BTREE",
        fields: [
          { name: "AuthorId" },
        ]
      },
    ]
  });
};
