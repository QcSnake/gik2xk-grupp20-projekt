const db = require('../models');
const bcrypt = require('bcrypt');

async function seedDatabase(forceProductRefresh = false) {
  try {
    // Create hashed passwords
    const adminPassword = await bcrypt.hash('Admin123', 10);
    const customerPassword = await bcrypt.hash('Customer123', 10);

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

    // Check if we should repopulate products
    const productCount = await db.product.count();
    if (productCount === 0 || forceProductRefresh) {
      if (forceProductRefresh) {
        // Delete existing products if forced refresh
        await db.product.destroy({ where: {}, truncate: { cascade: true } });
      }
      
      // Define products to create
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
      
      await db.product.bulkCreate(products);
      console.log('Products seeded successfully!');
    }

    console.log('Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

module.exports = seedDatabase;
