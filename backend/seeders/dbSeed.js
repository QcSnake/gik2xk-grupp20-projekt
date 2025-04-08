const db = require('../models');
const bcrypt = require('bcrypt');

async function seedDatabase(forceProductRefresh = false) {
  try {
    console.log("Starting database seed process...");
    
    // Create hashed passwords
    const adminPassword = await bcrypt.hash('Admin123', 10);
    const customerPassword = await bcrypt.hash('Customer123', 10);

    console.log("Creating users...");
    // Create admin user
    await db.user.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        f_name: 'Admin',
        l_name: 'User',
        password: adminPassword,
        role: 'admin'
      }
    });

    // Create customer user
    await db.user.findOrCreate({
      where: { email: 'customer@example.com' },
      defaults: {
        f_name: 'Regular',
        l_name: 'Customer',
        password: customerPassword,
        role: 'customer'
      }
    });

    // Check if the product model exists
    if (!db.product) {
      console.error("Product model not found in db object!");
      console.log("Available models:", Object.keys(db).filter(key => key !== 'sequelize' && key !== 'Sequelize'));
      
      // Create the products table if it doesn't exist
      await db.sequelize.query(`
        CREATE TABLE IF NOT EXISTS products (
          id INT PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(100) NOT NULL,
          description TEXT NOT NULL,
          price DOUBLE NOT NULL,
          product_img VARCHAR(500),
          units INT DEFAULT 0,
          created_at DATETIME NOT NULL,
          updated_at DATETIME NOT NULL
        )
      `);
      
      console.log("Created products table manually");
    }

    // Seed products manually if model isn't available
    const products = [
      {
        title: 'Monster Hunter World',
        description: 'An action role-playing game where you hunt impressive monsters in a living, breathing ecosystem.',
        price: 299.99,
        productImg: 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?q=80&w=1972&auto=format&fit=crop',
        units: 10
      },
      {
        title: 'Space Hunter',
        description: 'Explore the vastness of space and hunt alien creatures across different planets.',
        price: 349.99,
        productImg: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=2139&auto=format&fit=crop',
        units: 15
      },
      {
        title: 'Racing Evolution',
        description: 'Experience the thrill of high-speed racing with realistic physics and stunning graphics.',
        price: 249.99,
        productImg: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop',
        units: 20
      },
      {
        title: 'Cyberpunk 2077',
        description: 'An open-world, action-adventure game set in a megalopolis obsessed with power, glamour and body modification.',
        price: 399.99,
        productImg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
        units: 25
      },
      {
        title: 'The Elder Scrolls VI',
        description: 'The next chapter in the highly anticipated Elder Scrolls saga, featuring a vast open world and epic quests.',
        price: 449.99,
        productImg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
        units: 30
      }
    ];

    console.log('Seeding products...');
    if (db.product) {
      await db.product.bulkCreate(products);
    } else {
      // Insert manually if model doesn't exist
      for (const product of products) {
        await db.sequelize.query(`
          INSERT INTO products (title, description, price, product_img, units, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        `, {
          replacements: [
            product.title,
            product.description,
            product.price,
            product.productImg,
            product.units
          ]
        });
      }
    }
    
    console.log('Products seeded successfully!');
    console.log('Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// If this file is run directly
if (require.main === module) {
  // Connect to the database
  db.sequelize.authenticate()
    .then(() => {
      console.log('Connected to database');
      // Seed the database with force refresh
      return seedDatabase(true);
    })
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch(err => {
      console.error('Error seeding database:', err);
      process.exit(1);
    });
}

module.exports = seedDatabase;
