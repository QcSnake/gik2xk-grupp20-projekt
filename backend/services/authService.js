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
    if (!credentials.email || !credentials.password) {
      return createResponseError(400, "Email and password are required");
    }

    const user = await db.user.findOne({ where: { email: credentials.email } });
    
    if (!user) {
      return createResponseError(401, "Invalid email or password");
    }
    
    // Hantera användare utan lösenord
    if (!user.password || !user.password.startsWith('$2b$')) {
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
      
      return createResponseSuccess(userDetails);
    }
    
    // Jämför lösenord
    const passwordMatch = await bcrypt.compare(credentials.password, user.password);
    if (!passwordMatch) {
      return createResponseError(401, "Invalid email or password");
    }

    const userDetails = {
      id: user.id,
      email: user.email,
      f_name: user.f_name,
      l_name: user.l_name,
      role: user.role || 'customer'
    };

    return createResponseSuccess(userDetails);
  } catch (error) {
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

module.exports = {
  login,
  register,
  resetDatabase
};
