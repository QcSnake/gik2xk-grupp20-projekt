const db = require('../models');
const bcrypt = require('bcrypt');

async function seedDatabase(forceProductRefresh = false) {
  try {
    console.log("Startar databasinitiering...");
    
    // Skapa lösenord
    const adminPassword = await bcrypt.hash('Admin123', 10);
    const customerPassword = await bcrypt.hash('Customer123', 10);

    console.log("Skapar användare...");
    // Admin
    await db.user.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        f_name: 'Admin',
        l_name: 'User',
        password: adminPassword,
        role: 'admin'
      }
    });

    // Kund
    await db.user.findOrCreate({
      where: { email: 'customer@example.com' },
      defaults: {
        f_name: 'Regular',
        l_name: 'Customer',
        password: customerPassword,
        role: 'customer'
      }
    });

    // Kontrollera om produktmodellen finns
    if (!db.product) {
      console.error("Produktmodellen hittades inte!");
      console.log("Tillgängliga modeller:", Object.keys(db).filter(key => key !== 'sequelize' && key !== 'Sequelize'));
      
      // Skapa produkttabellen om den inte finns
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
      
      console.log("Skapade produkttabellen manuellt");
    }

    // Produktdata
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

    console.log('Lägger till produkter...');
    if (db.product) {
      await db.product.bulkCreate(products);
    } else {
      // Lägg till manuellt om modellen saknas
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
    
    console.log('Produkter tillagda!');
    console.log('Databasinitiering slutförd!');
    return true;
  } catch (error) {
    console.error('Fel vid initiering av databas:', error);
    throw error;
  }
}

// Om filen körs direkt
if (require.main === module) {
  
  db.sequelize.authenticate()
    .then(() => {
      console.log('Ansluten till databas');
      
      return seedDatabase(true);
    })
    .then(() => {
      console.log('Initiering slutförd');
      process.exit(0);
    })
    .catch(err => {
      console.error('Fel:', err);
      process.exit(1);
    });
}

module.exports = seedDatabase;
