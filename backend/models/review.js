module.exports = (sequelize, DataTypes) => {
  return sequelize.define("review", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    underscored: true,
    tableName: 'reviews'
  });
};