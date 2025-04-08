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

// Import all model files and add them to the db object
fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file !== "index.js" &&
      file !== "Product.js" // Skip uppercase Product.js file if it exists
  )
  .forEach((file) => {
    try {
      console.log(`Loading model from file: ${file}`);
      const modelModule = require(path.join(__dirname, file));
      
      // Check if the module is a function as expected by Sequelize
      if (typeof modelModule === 'function') {
        const model = modelModule(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
        console.log(`Successfully loaded model: ${model.name}`);
      } else {
        console.warn(`Skipping file ${file} - not a Sequelize model function`);
      }
    } catch (error) {
      console.error(`Error loading model from ${file}:`, error);
    }
  });

// Check if product model exists and create it if not
if (!db.product) {
  console.log("Product model not found, creating it manually");
  
  // Define product model manually if it wasn't loaded
  db.product = require('./product')(sequelize, Sequelize.DataTypes);
  console.log("Product model created manually:", db.product.name);
}

// Set up associations between models
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Define model relationships (only if all required models are loaded)
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
