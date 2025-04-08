module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "product", 
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      productImg: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'product_img'
      },
      units: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      }
    },
    { 
      underscored: true,
      tableName: 'products'
    }
  );
};