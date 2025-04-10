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
        title: 'Batman But Budget',
        description: 'Become vengeance… on a $5 budget. Mask may or may not strike fear.',
        price: 49.99,
        productImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTC7KempMJ_MCgNBPDDfKdltT8uwJ0joHWFQ&s',
        units: 5
      },
      {
        title: 'Premium Banana (Not Edible)',
        description: 'Looks like a banana. Smells like success. Zero nutritional value.',
        price: 999.99,
        productImg: 'https://i.guim.co.uk/img/media/d1df861697b94605d873dc74dc33a6bba5964209/0_80_4044_2428/master/4044.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=355f6eb5b8a7aa93bc478635fda58f87',
        units: 1
      },
      {
        title: 'Screaming Tea of Inner Peace',
        description: 'Organic herbal tea that helps you chill while screaming on the inside.',
        price: 19.99,
        productImg: 'https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9?q=80&w=2070&auto=format&fit=crop',
        units: 88
      },
      {
        title: 'The Forbidden Chair',
        description: 'Looks comfy. It’s not. But your enemies won’t know that.',
        price: 399.99,
        productImg: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop',
        units: 3
      },
      {
        title: 'Anti-Social Notebook',
        description: 'Lined pages for writing thoughts you’ll never share.',
        price: 14.99,
        productImg: 'https://www.meowingtons.com/cdn/shop/products/2523468133edf314e1eb144a1f479675.jpg?v=1571438642',
        units: 42
      },
      {
        title: 'Eau De Toast: Luxury Scent',
        description: 'Smell like warm bread and missed breakfasts. A true power move.',
        price: 89.99,
        productImg: 'https://thumbs.dreamstime.com/b/hands-holding-glass-jar-keeping-fresh-air-o-cloud-word-blue-sky-background-hands-holding-glass-jar-keeping-125235999.jpg',
        units: 17
      },
      {
        title: 'Sock Collection for People Who Hate Socks',
        description: 'Ironically designed for barefoot lovers. Includes one left sock only.',
        price: 9.99,
        productImg: 'https://images.unsplash.com/photo-1611095973515-6eb3a03ed57d?q=80&w=2070&auto=format&fit=crop',
        units: 56
      },
      {
        title: 'Mystery Liquid (Do Not Drink)',
        description: 'We don’t know what it is either. But it glows in the dark. Might be sentient.',
        price: 249.99,
        productImg: 'https://cdn.images.express.co.uk/img/dynamic/78/590x/Bottle-mystery-liquid-1013333.jpg?r=1536156918413',
        units: 12
      },
      {
        title: 'Emergency Burrito Blanket',
        description: 'Wrap yourself like a snack. Solves zero problems, but you’ll feel cozy.',
        price: 59.99,
        productImg: 'https://m.media-amazon.com/images/I/71U2j5vdbbL._AC_UF894,1000_QL80_.jpg',
        units: 9
      },
      {
        title: 'Microwave for One',
        description: 'Perfect for sad leftovers and lonelier nights. Comes with judgmental beep.',
        price: 149.99,
        productImg: 'https://compote.slate.com/images/2dca2f7c-537f-48ec-9e23-162b0097e7f8.jpeg?crop=1200%2C800%2Cx0%2Cy0',
        units: 7
      },
      {
        title: 'World’s Loudest Alarm Clock',
        description: 'Wakes the dead. Also your neighbors. Also, regret.',
        price: 89.99,
        productImg: 'https://images.unsplash.com/photo-1587314168485-3236c162f38e?q=80&w=2070&auto=format&fit=crop',
        units: 4
      },
      {
        title: 'Invisibility Cloak (Doesn’t Work)',
        description: 'We promise it’s there. You just can’t see it. Refunds not allowed.',
        price: 999.99,
        productImg: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=2070&auto=format&fit=crop',
        units: 1
      },
      {
        title: 'Premium Air (Limited Edition)',
        description: 'Canned from the top of Mount Photoshop. Oxygen not guaranteed.',
        price: 499.99,
        productImg: 'https://images.unsplash.com/photo-1580753705042-6f91db8f7d86?q=80&w=2070&auto=format&fit=crop',
        units: 20
      },
      {
        title: 'Haunted Mirror (Probably)',
        description: 'Vintage. Cracked. Screams occasionally. Adds personality to any room.',
        price: 74.99,
        productImg: 'https://images.unsplash.com/photo-1589463655194-11e9f1610ecb?q=80&w=2070&auto=format&fit=crop',
        units: 6
      },
      {
        title: 'Portable Existential Crisis',
        description: 'Pocket-sized booklet of “why are we here?” moments. Includes bonus void sticker.',
        price: 39.99,
        productImg: 'https://images.unsplash.com/photo-1600073642459-e92bd9a8e858?q=80&w=2070&auto=format&fit=crop',
        units: 33
      },
      {
        title: 'Toilet Paper NFT (Physical Copy)',
        description: 'Yes. It’s a real roll. Yes. It’s also on the blockchain.',
        price: 699.99,
        productImg: 'https://images.unsplash.com/photo-1585241742994-3f2f522ebc52?q=80&w=2070&auto=format&fit=crop',
        units: 2
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
