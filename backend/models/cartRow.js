module.exports = (sequelize, DataTypes) => {
    return sequelize.define("cartRow", {
        
        cartId: {
            type: DataTypes.INTEGER,
            field: 'cart_id',
            references: {
                model: 'carts',
                key: 'id'
            }
        },
        productId: {
            type: DataTypes.INTEGER,
            field: 'product_id',
            references: {
                model: 'products',
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    }, {
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['cart_id', 'product_id']
            }
        ]
    });
};