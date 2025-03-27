module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      "product",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: DataTypes.STRING(100),
          allowNull: false,
          validate: {
            len: [2, 100],
          },
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        price: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        productImg:{
          type: DataTypes.STRING(255),
          validate: {
            isUrl: true
          }
        },
         units: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },


      },
      { underscored: true }
    );
};