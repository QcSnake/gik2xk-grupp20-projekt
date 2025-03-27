module.exports = (sequelize, DataTypes) => {
    return sequelize.define("cartRow", {}, {underscored: true});
};