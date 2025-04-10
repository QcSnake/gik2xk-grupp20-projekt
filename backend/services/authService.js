const db = require("../models");
const bcrypt = require("bcrypt");
const {
  createResponseSuccess,
  createResponseError,
  createResponseMessage,
} = require("../helpers/responseHelper");
const seedDatabase = require("../seeders/dbSeed");

async function login(credentials) {
  try {
    console.log("Login försök:", credentials.email);
    
    if (!credentials.email || !credentials.password) {
      console.log("Email eller lösenord saknas");
      return createResponseError(400, "Email and password are required");
    }

    const user = await db.user.findOne({ where: { email: credentials.email } });
    
    if (!user) {
      console.log(`Användare med email ${credentials.email} hittades inte`);
      return createResponseError(401, "Invalid email or password");
    }
    
    console.log(`Användare hittad: ${user.email} (${user.role})`);
    
    // Hantera användare utan lösenord eller med fel hash-format
    if (!user.password || (!user.password.startsWith('$2b$') && !user.password.startsWith('$2a$'))) {
      console.log("Användare har inget ordentligt hashat lösenord, skapar nytt");
      const hashedPassword = await bcrypt.hash(credentials.password, 10);
      await user.update({ 
        password: hashedPassword,
        role: user.role || 'customer' 
      });
      
      const userDetails = {
        id: user.id,
        email: user.email,
        f_name: user.f_name,
        l_name: user.l_name,
        role: user.role || 'customer'
      };
      
      console.log("Inloggning lyckades med uppdaterat lösenord");
      return createResponseSuccess(userDetails);
    }
    
    // Jämför lösenord
    console.log("Jämför lösenord med bcrypt");
    const passwordMatch = await bcrypt.compare(credentials.password, user.password);
    
    if (!passwordMatch) {
      console.log("Lösenord matchar inte");
      return createResponseError(401, "Invalid email or password");
    }

    // Om lösenordet stämde, skapa användarobjekt att skicka tillbaka
    const userDetails = {
      id: user.id,
      email: user.email,
      f_name: user.f_name,
      l_name: user.l_name,
      role: user.role || 'customer'
    };

    console.log("Inloggning lyckades");
    return createResponseSuccess(userDetails);
  } catch (error) {
    console.error("Login error:", error);
    return createResponseError(error.status || 500, error.message);
  }
}

async function register(userData) {
  try {
    if (!userData.email || !userData.password || !userData.f_name || !userData.l_name) {
      return createResponseError(400, "Email, password, first name, and last name are required");
    }

    const existingUser = await db.user.findOne({ where: { email: userData.email } });
    if (existingUser) {
      return createResponseError(409, "A user with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const newUser = await db.user.create({
      email: userData.email,
      password: hashedPassword,
      f_name: userData.f_name,
      l_name: userData.l_name,
      role: 'customer'
    });

    const userDetails = {
      id: newUser.id,
      email: newUser.email,
      f_name: newUser.f_name,
      l_name: newUser.l_name,
      role: newUser.role
    };

    return createResponseSuccess(userDetails);
  } catch (error) {
    return createResponseError(error.status || 500, error.message);
  }
}

// Återställ databas
async function resetDatabase() {
  try {
    await seedDatabase(true);
    return createResponseMessage(200, "Database reset successfully");
  } catch (error) {
    return createResponseError(500, "Failed to reset database: " + error.message);
  }
}

// Create a special admin function to ensure at least one admin account exists 
// and has the correct credentials
async function ensureAdminAccount() {
  try {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'Admin123';
    
    // Find or create admin account
    const [admin, created] = await db.user.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        f_name: 'Admin',
        l_name: 'User',
        password: await bcrypt.hash(adminPassword, 10),
        role: 'admin'
      }
    });
    
    // If found but might have wrong password, update it
    if (!created) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await admin.update({ password: hashedPassword });
      console.log("Admin-konto uppdaterat");
    }
    
    // Do the same for customer account
    const customerEmail = 'customer@example.com';
    const customerPassword = 'Customer123';
    
    const [customer, customerCreated] = await db.user.findOrCreate({
      where: { email: customerEmail },
      defaults: {
        f_name: 'Regular',
        l_name: 'Customer',
        password: await bcrypt.hash(customerPassword, 10),
        role: 'customer'
      }
    });
    
    if (!customerCreated) {
      const hashedPassword = await bcrypt.hash(customerPassword, 10);
      await customer.update({ password: hashedPassword });
      console.log("Kundkonto uppdaterat");
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring admin account:", error);
    return false;
  }
}

module.exports = {
  login,
  register,
  resetDatabase,
  ensureAdminAccount  // Export the new function
};
