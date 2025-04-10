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
        description: 'Bli hämnden... med en budget på 59 kr. Masken kanske inte skrämmer någon.',
        price: 49.99,
        productImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTC7KempMJ_MCgNBPDDfKdltT8uwJ0joHWFQ&s',
        units: 5
      },
      {
        title: 'Premium Banana (Not Edible)',
        description: 'Ser ut som en banan. Luktar framgång. Inget näringsvärde alls.',
        price: 999.99,
        productImg: 'https://i.guim.co.uk/img/media/d1df861697b94605d873dc74dc33a6bba5964209/0_80_4044_2428/master/4044.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=355f6eb5b8a7aa93bc478635fda58f87',
        units: 1
      },
      {
        title: 'Screaming Tea of Inner Peace',
        description: 'Ekologiskt örtte som hjälper dig att slappna av medan du skriker inombords.',
        price: 19.99,
        productImg: 'https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9?q=80&w=2070&auto=format&fit=crop',
        units: 88
      },
      {
        title: 'The Forbidden Chair',
        description: 'Ser bekväm ut. Är det inte. Men dina fiender kommer aldrig veta.',
        price: 399.99,
        productImg: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop',
        units: 3
      },
      {
        title: 'Anti-Social Notebook',
        description: 'Linjerade sidor för tankar du ändå aldrig kommer dela med dig av.',
        price: 14.99,
        productImg: 'https://www.meowingtons.com/cdn/shop/products/2523468133edf314e1eb144a1f479675.jpg?v=1571438642',
        units: 42
      },
      {
        title: 'Eau De Toast: Luxury Scent',
        description: 'Lukta som varmt bröd och missade frukostar. Maktens doft.',
        price: 89.99,
        productImg: 'https://thumbs.dreamstime.com/b/hands-holding-glass-jar-keeping-fresh-air-o-cloud-word-blue-sky-background-hands-holding-glass-jar-keeping-125235999.jpg',
        units: 17
      },
      {
        title: 'Sock Collection for People Who Hate Socks',
        description: 'Ironiskt nog designade för barfota-fans. Innehåller bara en vänsterstrumpa.',
        price: 9.99,
        productImg: 'https://media.kohlsimg.com/is/image/kohls/7072843_Gray?wid=400&hei=400&op_sharpen=1',
        units: 56
      },
      {
        title: 'Mystery Liquid (Do Not Drink)',
        description: 'Vi vet inte heller vad det är. Men det lyser i mörkret. Kan vara levande.',
        price: 249.99,
        productImg: 'https://cdn.images.express.co.uk/img/dynamic/78/590x/Bottle-mystery-liquid-1013333.jpg?r=1536156918413',
        units: 12
      },
      {
        title: 'Emergency Burrito Blanket',
        description: 'Svep in dig som ett snacks. Löser inget, men du blir varm och go.',
        price: 59.99,
        productImg: 'https://m.media-amazon.com/images/I/71U2j5vdbbL._AC_UF894,1000_QL80_.jpg',
        units: 9
      },
      {
        title: 'Microwave for One',
        description: 'Perfekt för ledsna rester och ännu ledsnare kvällar. Ger ifrån sig ett dömande pip.',
        price: 149.99,
        productImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVRigjKdO83shjnl76FIztZDYt7dDBuTL_Xw&s',
        units: 7
      },
      {
        title: 'World’s Loudest Alarm Clock',
        description: 'Väcker döda. Och grannar. Och din ångest.',
        price: 89.99,
        productImg: 'https://static.neatorama.com/images/2012-05/tower-clock-hotel-1.jpg',
        units: 4
      },
      {
        title: 'Invisibility Cloak (Doesn’t Work)',
        description: 'Vi lovar att den finns. Du ser den bara inte. Inga återköp.',
        price: 999.99,
        productImg: 'https://m.media-amazon.com/images/I/91hTzpGFfKL._AC_UY1000_.jpg',
        units: 1
      },
      {
        title: 'Premium Air (Limited Edition)(Jar not included)',
        description: 'Från toppen av Mount Photoshop. Syre ej garanterat.',
        price: 499.99,
        productImg: 'https://www.ikea.com/se/en/images/products/korken-jar-with-lid-clear-glass__0713739_pe729738_s5.jpg',
        units: 20
      },
      {
        title: 'Haunted Mirror (Real Ghosts Included)',
        description: 'Vintage. Sprucken. Skriker ibland. Ger rummet karaktär.',
        price: 74.99,
        productImg: 'https://images.stockcake.com/public/1/1/b/11b8b9b3-9034-4852-a619-b7398a6daeb8_large/haunted-mirror-glows-stockcake.jpg',
        units: 6
      },
      {
        title: 'Portable Existential Crisis',
        description: 'Fickstor bok med "varför finns vi?"-moment. Bonus: klistermärke med tomrummet.',
        price: 39.99,
        productImg: 'https://alphamom.com/wp-content/uploads/2016/08/family-finance-anxieties-e1472585368855.jpg',
        units: 33
      },
      {
        title: 'Toilet Paper NFT (Physical Copy)',
        description: 'Ja, det är en riktig rulle. Ja, den finns också på blockchainen.',
        price: 699.99,
        productImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6OIQUiOMhj_O_4106FrhlMiSxB1f4FAn7WA&s',
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
