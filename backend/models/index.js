const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file !== "index.js"
  )
  .forEach((file) => {
    try {
      const modelModule = require(path.join(__dirname, file));
      
      if (typeof modelModule === 'function') {
        const model = modelModule(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
      }
    } catch (error) {
      console.error(`Error loading model from ${file}:`, error);
    }
  });

if (!db.product) {
  db.product = require('./product')(sequelize, Sequelize.DataTypes);
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Definierar relationerna mellan modellerna
if (db.user && db.review) {
  db.user.hasMany(db.review);
  db.review.belongsTo(db.user);
}

if (db.product && db.review) {
  db.product.hasMany(db.review);
  db.review.belongsTo(db.product);
}

if (db.user && db.cart) {
  db.user.hasMany(db.cart);
  db.cart.belongsTo(db.user);
}

if (db.cart && db.product && db.cartRow) {
  db.cart.belongsToMany(db.product, { 
    through: {
      model: db.cartRow,
      unique: false
    },
    constraints: false
  });
  
  db.product.belongsToMany(db.cart, { 
    through: {
      model: db.cartRow,
      unique: false
    },
    constraints: false
  });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
