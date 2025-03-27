module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "cart",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      units: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      }
   
    },
    { underscored: true }
    
  );
};
