module.exports = (sequelize, DataTypes) => {
    return sequelize.define('review', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },        
        rating: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        summary: {
           type: DataTypes.TEXT,
            allowNull: false
        }
    },
        {underscored: true}
    );
};