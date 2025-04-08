module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      "user",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        email: {
          type: DataTypes.STRING(200),
          allowNull: false,
          validate: {
            len: [4, 200],
            isEmail: true,
          },
        },
        f_name: DataTypes.STRING(50),
        l_name: DataTypes.STRING(50),
        password: {
          type: DataTypes.STRING(200),
          allowNull: true,
        },
        role: {
          type: DataTypes.ENUM('admin', 'customer'),
          defaultValue: 'customer',
          allowNull: true // Temporarily
        }
      },
      {
        underscored: true,
       
      }
    );
    
};